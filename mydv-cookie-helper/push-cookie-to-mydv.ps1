param(
    [Parameter(Mandatory = $true)]
    [string]$Target,

    [string]$CookieFile = "d:\tools\douyintv\mydv-cookie-helper\douyin-cookie-for-mydv.txt"
)

$ErrorActionPreference = "Stop"

function Resolve-SubmitUrl {
    param([string]$Value)

    if ($Value -match '^https?://') {
        if ($Value.EndsWith('/api/submit')) {
            return $Value
        }
        if ($Value.EndsWith('/submit')) {
            return ($Value.TrimEnd('/')) + '/api/submit'
        }
        return ($Value.TrimEnd('/')) + '/api/submit'
    }

    return "http://$Value`:9978/api/submit"
}

if (-not (Test-Path -LiteralPath $CookieFile)) {
    throw "找不到 Cookie 文件: $CookieFile"
}

$cookie = (Get-Content -LiteralPath $CookieFile -Raw).Trim()
if ([string]::IsNullOrWhiteSpace($cookie)) {
    throw "Cookie 文件为空: $CookieFile"
}

$url = Resolve-SubmitUrl -Value $Target
$body = @{
    cookie = $cookie
} | ConvertTo-Json -Compress

Write-Host "推送地址: $url"
Write-Host "Cookie 长度: $($cookie.Length)"

$response = Invoke-RestMethod -Uri $url -Method POST -ContentType "application/json" -Body $body -TimeoutSec 20
$response | ConvertTo-Json -Depth 5
