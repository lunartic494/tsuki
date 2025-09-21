import { TOGGLE_BUTTON_NAME, initializePresetManager } from './初始化和配置';
import { forceRestoreGrouping, restoreGroupingDelayed, restoreGroupingFromConfig } from './条目分组功能';
import { createUI, toggleUI } from './界面创建和管理';
import { onChatChanged } from './角色绑定功能';

// 防止重复初始化的全局标记
const SCRIPT_ID = 'MIAO_MIAO_PRESET_MANAGER';

// 等待必要的全局变量加载完成
function checkReady(): void {
  const win = window as unknown as Record<string, unknown>;
  if (
    win.jQuery &&
    win.TavernHelper &&
    typeof TavernHelper.createOrReplaceWorldbook === 'function' &&
    win.tavern_events &&
    typeof getButtonEvent === 'function'
  ) {
    initScript();
  } else {
    setTimeout(checkReady, 100);
  }
}

function init(): void {
  // 简化重复检查 - 只检查UI是否已存在，如果存在就跳过初始化
  const win = window as unknown as Record<string, unknown>;
  if (win[SCRIPT_ID]) {
    console.log('⚠️ 喵喵预设配置管理已存在，跳过重复初始化');
    return;
  }

  // 设置全局标记
  win[SCRIPT_ID] = true;
  win.miaoMiaoPresetManager = true;

  console.log('🔥 jQuery ready 事件触发...');
  checkReady();
}

async function initScript(): Promise<void> {
  try {
    console.log('🚀 喵喵预设配置管理开始初始化...');

    // 初始化配置管理器
    await initializePresetManager();
    console.log('✅ 配置管理器初始化完成');

    // 创建UI界面
    createUI();
    console.log('✅ UI界面创建完成');

    // 注册按钮事件
    const buttonEventId = getButtonEvent(TOGGLE_BUTTON_NAME);
    eventOn(buttonEventId, toggleUI);
    console.log('✅ 按钮事件已注册:', buttonEventId);

    // 注册角色切换事件
    eventOn(tavern_events.CHAT_CHANGED, onChatChanged);

    // 延迟加载非关键功能，避免阻塞UI
    setTimeout(() => {
      initNonCriticalFeatures();
    }, 100);

    console.log('✅ 喵喵预设配置管理已加载成功!');
  } catch (error) {
    console.error('初始化喵喵预设配置管理失败:', error);
    toastr.error('喵喵预设配置管理加载失败，请检查控制台');
  }
}

// 初始化非关键功能，避免阻塞主UI
function initNonCriticalFeatures(): void {
  try {
    // 恢复分组配置
    eventOn(tavern_events.SETTINGS_LOADED, restoreGroupingFromConfig);

    // 监听预设变化，如果存在该事件的话
    const tavernEventsExt = tavern_events as Record<string, string>;
    if (tavernEventsExt.PRESET_CHANGED) {
      eventOn(tavernEventsExt.PRESET_CHANGED, restoreGroupingFromConfig);
    }

    // 监听预设界面变化，延迟恢复分组
    if (tavernEventsExt.PROMPT_MANAGER_UPDATED) {
      eventOn(tavernEventsExt.PROMPT_MANAGER_UPDATED, () => restoreGroupingDelayed(300));
    }

    // 监听设置更新事件，这通常在条目开关后触发
    eventOn(tavern_events.SETTINGS_UPDATED, () => {
      console.log('检测到设置更新，准备恢复分组');
      restoreGroupingDelayed(800);
    });

    // 优化DOM观察器 - 使用防抖机制
    let restoreTimeout: number | null = null;
    const observer = new MutationObserver(mutations => {
      let shouldRestore = false;
      mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
          const target = mutation.target as Element;
          // 检查是否是预设管理器的条目变化
          if (
            target.classList?.contains('completion_prompt_manager') ||
            target.querySelector?.('.completion_prompt_manager_prompt') ||
            // 检查是否是预设条目本身的变化
            target.classList?.contains('completion_prompt_manager_prompt') ||
            // 检查是否是分组容器的变化
            target.classList?.contains('prompt-group-container')
          ) {
            shouldRestore = true;
          }
        }

        // 检查属性变化（如开关状态变化）
        if (mutation.type === 'attributes') {
          const target = mutation.target as Element;
          if (
            target.classList?.contains('completion_prompt_manager_prompt') ||
            target.closest?.('.completion_prompt_manager_prompt')
          ) {
            shouldRestore = true;
          }
        }
      });

      if (shouldRestore) {
        // 防抖处理，避免频繁触发
        if (restoreTimeout) {
          clearTimeout(restoreTimeout);
        }
        restoreTimeout = window.setTimeout(() => {
          console.log('检测到预设条目变化，准备恢复分组');
          restoreGroupingDelayed(500);
        }, 200);
      }
    });

    // 开始观察预设管理器区域的变化
    const presetManagerContainer = $('.completion_prompt_manager').get(0);
    if (presetManagerContainer) {
      observer.observe(presetManagerContainer, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'data-pm-identifier'],
      });
      console.log('✅ 预设管理器DOM观察器已启动');
    }

    // 延迟恢复分组，避免阻塞UI加载
    setTimeout(() => {
      console.log('🔄 脚本加载完成，开始强制恢复分组配置...');
      forceRestoreGrouping();
    }, 2000);

    console.log('✅ 非关键功能初始化完成');
  } catch (error) {
    console.error('初始化非关键功能失败:', error);
  }
}

// 在加载脚本时执行初始化
console.log('🔥 喵喵预设配置管理模块开始加载...');
$(() => init());

// 在卸载脚本时执行清理
$(window).on('pagehide', () => {
  // 清理全局标记
  const win = window as unknown as Record<string, unknown>;
  delete win[SCRIPT_ID];
  delete win.miaoMiaoPresetManager;

  // 快速清理UI元素，避免阻塞
  const uiElement = document.getElementById('preset-manager-ui');
  const fileElement = document.getElementById('preset-manager-import-file');

  if (uiElement) {
    uiElement.remove();
  }
  if (fileElement) {
    fileElement.remove();
  }

  // 异步清理分组效果，避免阻塞页面卸载
  setTimeout(async () => {
    try {
      const { clearAllGrouping } = await import('./条目分组功能');
      clearAllGrouping();
    } catch (error) {
      // 忽略清理错误
    }
  }, 0);

  console.log('✅ 喵喵预设配置管理已卸载');
});
