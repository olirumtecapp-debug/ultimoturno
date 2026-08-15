# Script PowerShell para sintetizar todos os diálogos de O ÚLTIMO TURNO via Edge TTS
param(
    [string]$OutputDir = "$PSScriptRoot\..\assets\audio"
)

$OutputDir = [System.IO.Path]::GetFullPath($OutputDir)
if (!(Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null
}

function Synthesize-EdgeTTS {
    param(
        [string]$Text,
        [string]$OutputFile,
        [string]$Voice = "pt-BR-AntonioNeural",
        [string]$Rate = "-8%",
        [string]$Pitch = "-4Hz"
    )

    $fileName = [System.IO.Path]::GetFileName($OutputFile)
    Write-Host "Sintetizando [$Voice] $fileName..." -NoNewline

    try {
        $ws = New-Object System.Net.WebSockets.ClientWebSocket
        $ws.Options.SetRequestHeader("Origin", "chrome-extension://jdiccldimpdaibmpdkjnbmckianbfold")

        $connId = [Guid]::NewGuid().ToString("N")
        $uriStr = "wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1?TrustedClientToken=6A5AA1D4EAFF4E9FB37E23D68491D6F4&ConnectionId=$connId"
        $uri = [Uri]$uriStr
        
        $cts = New-Object System.Threading.CancellationTokenSource(20000)
        $ws.ConnectAsync($uri, $cts.Token).Wait()

        if ($ws.State -ne [System.Net.WebSockets.WebSocketState]::Open) {
            Write-Host " [ERRO: Conexão não aberta]" -ForegroundColor Red
            return
        }

        # 1. Envia Configuração de Áudio
        $timestamp = [DateTimeOffset]::UtcNow.ToString("yyyy-MM-ddTHH:mm:ss.fffK")
        $configJson = "{`"context`":{`"synthesis`":{`"audio`":{`"metadataoptions`":{`"sentenceBoundaryEnabled`":`"false`",`"wordBoundaryEnabled`":`"false`"},`"outputFormat`":`"audio-24khz-48kbitrate-mono-mp3`"}}}}"
        $configMsg = "X-Timestamp:$timestamp`r`nContent-Type:application/json; charset=utf-8`r`nPath:speech.config`r`n`r`n$configJson"
        $configBytes = [System.Text.Encoding]::UTF8.GetBytes($configMsg)
        $ws.SendAsync([ArraySegment[byte]]::new($configBytes), [System.Net.WebSockets.WebSocketMessageType]::Text, $true, $cts.Token).Wait()

        # 2. Envia SSML com prosódia dramática
        $reqId = [Guid]::NewGuid().ToString("N")
        $ssml = "<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='pt-BR'><voice name='$Voice'><prosody pitch='$Pitch' rate='$Rate'>$Text</prosody></voice></speak>"
        $ssmlMsg = "X-RequestId:$reqId`r`nContent-Type:application/ssml+xml`r`nPath:ssml`r`n`r`n$ssml"
        $ssmlBytes = [System.Text.Encoding]::UTF8.GetBytes($ssmlMsg)
        $ws.SendAsync([ArraySegment[byte]]::new($ssmlBytes), [System.Net.WebSockets.WebSocketMessageType]::Text, $true, $cts.Token).Wait()

        # 3. Recebe Pacotes de Áudio Binário
        $ms = New-Object System.IO.MemoryStream
        $buffer = [byte[]]::new(65536)

        while ($ws.State -eq [System.Net.WebSockets.WebSocketState]::Open) {
            $res = $ws.ReceiveAsync([ArraySegment[byte]]::new($buffer), $cts.Token).Result

            if ($res.MessageType -eq [System.Net.WebSockets.WebSocketMessageType]::Close) {
                break
            }

            if ($res.MessageType -eq [System.Net.WebSockets.WebSocketMessageType]::Binary) {
                if ($res.Count -gt 2) {
                    $headerLen = [System.Net.IPAddress]::NetworkToHostOrder([BitConverter]::ToInt16($buffer, 0))
                    $audioOffset = 2 + $headerLen
                    $audioLen = $res.Count - $audioOffset
                    if ($audioLen -gt 0 -and $audioOffset -lt $res.Count) {
                        $ms.Write($buffer, $audioOffset, $audioLen)
                    }
                }
            } elseif ($res.MessageType -eq [System.Net.WebSockets.WebSocketMessageType]::Text) {
                $txt = [System.Text.Encoding]::UTF8.GetString($buffer, 0, $res.Count)
                if ($txt -match "Path:turn.end") {
                    break
                }
            }
        }

        $ws.Dispose()

        if ($ms.Length -gt 0) {
            [System.IO.File]::WriteAllBytes($OutputFile, $ms.ToArray())
            Write-Host " [OK: $($ms.Length) bytes]" -ForegroundColor Green
        } else {
            Write-Host " [AVISO: 0 bytes]" -ForegroundColor Yellow
        }
    } catch {
        Write-Host " [FALHA: $_]" -ForegroundColor Red
    }
}

# Teste inicial
Synthesize-EdgeTTS -Text "Minha cabeça... dói como se tivesse levado uma pancada." -OutputFile "$OutputDir\test.mp3"
