import { TOGGLE_BUTTON_NAME, initializePresetManager } from './初始化和配置';
import { createUI, toggleUI } from './界面创建和管理';
import { onChatChanged } from './角色绑定功能';
import { restoreGroupingFromConfig } from './条目分组功能';

// 在加载脚本时执行初始化
$(() => {
  // 等待必要的全局变量加载完成
  function checkReady(): void {
    if (
      (window as any).jQuery &&
      (window as any).TavernHelper &&
      typeof TavernHelper.createOrReplaceWorldbook === 'function' &&
      (window as any).tavern_events &&
      typeof getButtonEvent === 'function'
    ) {
      initScript();
    } else {
      setTimeout(checkReady, 150);
    }
  }

  async function initScript(): Promise<void> {
    try {
      // 初始化配置管理器
      await initializePresetManager();

      // 创建UI界面
      createUI();

      // 注册按钮事件
      eventOn(getButtonEvent(TOGGLE_BUTTON_NAME), toggleUI);

      // 注册角色切换事件
      eventOn(tavern_events.CHAT_CHANGED, onChatChanged);

      // 恢复分组配置
      eventOn(tavern_events.SETTINGS_LOADED, restoreGroupingFromConfig);

      // 监听预设变化，如果存在该事件的话
      if ((tavern_events as any).PRESET_CHANGED) {
        eventOn((tavern_events as any).PRESET_CHANGED, restoreGroupingFromConfig);
      }

      toastr.success('喵喵预设配置管理已加载成功!', '恭喜!');
    } catch (error) {
      console.error('初始化喵喵预设配置管理失败:', error);
      toastr.error('喵喵预设配置管理加载失败，请检查控制台');
    }
  }

  checkReady();
});

// 在卸载脚本时执行清理
$(window).on('pagehide', () => {
  // 清理分组效果
  try {
    const { clearAllGrouping } = require('./条目分组功能');
    clearAllGrouping();
  } catch (error) {
    // 忽略清理错误
  }

  toastr.info('喵喵预设配置管理已卸载', '再见!');
});
