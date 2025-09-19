import { lastProcessedCharAvatar, setLastProcessedCharAvatar } from './初始化和配置';
import { getStoredConfigs } from './配置存储和读取';
import { loadConfig } from './配置操作功能';

export async function onChatChanged(): Promise<void> {
  try {
    await new Promise(resolve => setTimeout(resolve, 250));
    const charData = await TavernHelper.getCharData('current');

    if (!charData || !charData.avatar || charData.avatar === lastProcessedCharAvatar) {
      if (!charData || !charData.avatar) setLastProcessedCharAvatar(null);
      return;
    }

    setLastProcessedCharAvatar(charData.avatar);

    const configs = await getStoredConfigs();
    const boundConfigs = Object.values(configs).filter(config => config.boundCharAvatar === charData.avatar);

    if (boundConfigs.length === 0) return;

    let configIdToLoad: string | null = null;

    if (boundConfigs.length === 1) {
      const singleConfig = boundConfigs[0];
      const popupText = `角色 "${charData.name}" 拥有绑定的配置 "${singleConfig.name}"。是否要加载此配置？`;
      const userChoice = await triggerSlash(`/popup okButton="加载" cancelButton="取消" result=true "${popupText}"`);
      if (userChoice === '1') configIdToLoad = singleConfig.id;
    } else {
      const { showConfigSelectionPopup } = await import('./辅助弹窗功能');
      configIdToLoad = await showConfigSelectionPopup(boundConfigs, charData.name);
    }

    if (configIdToLoad) await loadConfig(configIdToLoad, false);
  } catch (error) {
    console.error('检查绑定配置时出错:', error);
    toastr.error('检查角色绑定配置时出错。');
  }
}
