import SettingsManager from "./utilities/settingsManager.ts"
import GameCoordinator from "./core/gameCoordinator.ts"

  window.onload = async () => {
    window.gc = new GameCoordinator()
    window.settings = new SettingsManager(window.gc)
    await window.settings.load()
    window.settings.apply()
    window.settings.initUi()    
  }