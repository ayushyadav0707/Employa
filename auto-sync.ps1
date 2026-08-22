Write-Host "============================================="
Write-Host "Dayflow HRMS - Auto Sync Started"
Write-Host "============================================="
Write-Host "This script will commit and push changes every 3 minutes."
Write-Host "Press Ctrl+C to stop syncing."
Write-Host ""

while ($true) {
    $status = git status --porcelain
    if ($status) {
        Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Changes detected. Syncing..." -ForegroundColor Yellow
        git add .
        git commit -m "chore: auto-sync $(Get-Date -Format 'HH:mm:ss')"
        git push origin main
        Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Sync complete!" -ForegroundColor Green
    } else {
        Write-Host "[$(Get-Date -Format 'HH:mm:ss')] No changes detected." -ForegroundColor DarkGray
    }
    
    # Wait for 3 minutes (180 seconds) before checking again
    Start-Sleep -Seconds 180
}
