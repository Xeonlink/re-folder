!macro customHeader
  !system "echo '' > ${BUILD_RESOURCES_DIR}/customHeader"
!macroend

!macro preInit
  ; This macro is inserted at the beginning of the NSIS .OnInit callback
  !system "echo '' > ${BUILD_RESOURCES_DIR}/preInit"
!macroend

!macro customInit
  !system "echo '' > ${BUILD_RESOURCES_DIR}/customInit"
!macroend

!macro customInstall
  !system "echo '' > ${BUILD_RESOURCES_DIR}/customInstall"
!macroend

!macro customInstallMode
  # set $isForceMachineInstall or $isForceCurrentInstall
  # to enforce one or the other modes.
!macroend

!macro customWelcomePage
  # Welcome Page is not added by default for installer.
  !insertMacro MUI_PAGE_WELCOME
!macroend

!macro customUnWelcomePage
  !define MUI_WELCOMEPAGE_TITLE "custom title for uninstaller welcome page"
  !define MUI_WELCOMEPAGE_TEXT "custom text for uninstaller welcome page $\r$\n more"
  !insertmacro MUI_UNPAGE_WELCOME
!macroend

!macro customUnInstall
  ; Define the process name of your Electron app
  StrCpy $0 "ReFolder.exe"

  ; Check if the application is running
  nsExec::ExecToStack 'tasklist /FI "IMAGENAME eq $0" /NH'
  Pop $1

  StrCmp $1 "" notRunning

  ; If the app is running, notify the user and attempt to close it
  MessageBox MB_OK "YourApp is being uninstalled." IDOK forceClose

  forceClose:
    ; Attempt to kill the running application
    nsExec::ExecToStack 'taskkill /F /IM $0'
    Pop $1

    ; Proceed with uninstallation
    Goto continueUninstall

  notRunning:
    ; If the app is not running, proceed with uninstallation
    Goto continueUninstall

  continueUninstall:
    ; Proceed with uninstallation
    DeleteRegKey HKLM "Software\YourApp"
    RMDir /r "$INSTDIR"
    Delete "$INSTDIR\*.*"

    ; Clean up shortcuts and app data
    Delete "$DESKTOP\YourApp.lnk"
    Delete "$STARTMENU\Programs\YourApp.lnk"
    RMDir /r "$APPDATA\YourApp"

    ; Close the uninstaller
    Quit
!macroend