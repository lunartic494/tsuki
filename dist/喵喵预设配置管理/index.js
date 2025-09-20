/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
import * as __WEBPACK_EXTERNAL_MODULE_https_testingcf_jsdelivr_net_npm_downloadjs_esm_f6aff769__ from "https://testingcf.jsdelivr.net/npm/downloadjs/+esm";
/******/ var __webpack_modules__ = ({

/***/ 11:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   exportConfig: () => (/* binding */ exportConfig),\n/* harmony export */   handleFileImport: () => (/* binding */ handleFileImport)\n/* harmony export */ });\n/* harmony import */ var downloadjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! downloadjs */ \"downloadjs\");\n/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./初始化和配置 */ \"./src/喵喵预设配置管理/初始化和配置.ts\");\n/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./条目分组功能 */ \"./src/喵喵预设配置管理/条目分组功能.ts\");\n/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./正则绑定功能 */ \"./src/喵喵预设配置管理/正则绑定功能.ts\");\n/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./配置存储和读取 */ \"./src/喵喵预设配置管理/配置存储和读取.ts\");\n\n\n\n\n\nasync function exportConfig(configId) {\n    try {\n        const configs = await (0,___WEBPACK_IMPORTED_MODULE_4__.getStoredConfigs)();\n        const configData = configs[configId];\n        if (!configData) {\n            toastr.error(`配置不存在，无法导出。`);\n            return;\n        }\n        const configName = configData.name;\n        let userRemark = '';\n        const addRemarkChoice = await triggerSlash(`/popup okButton=\"是\" cancelButton=\"否\" result=true \"是否要为此导出添加备注信息？\"`);\n        if (addRemarkChoice === '1') {\n            userRemark = await triggerSlash(`/input multiline=true placeholder=\"请输入备注，例如预设用途、来源等...\" \"添加备注\"`);\n        }\n        const exportBundle = {\n            type: 'MiaoMiaoPresetBundle',\n            version: 1,\n            remark: userRemark || '',\n            presetConfig: configData,\n            presetData: null,\n            regexData: null,\n            groupingConfig: null,\n        };\n        const configPresetName = configData.presetName;\n        if (configPresetName && TavernHelper.getPresetNames().includes(configPresetName)) {\n            const includePresetChoice = await triggerSlash(`/popup okButton=\"是\" cancelButton=\"否\" result=true \"此配置关联了预设 \\\\\"${configPresetName}\\\\\"。是否要将预设文件本身一起打包导出？\"`);\n            if (includePresetChoice === '1') {\n                const presetData = TavernHelper.getPreset(configPresetName);\n                if (presetData) {\n                    presetData.name = configPresetName;\n                    exportBundle.presetData = presetData;\n                    toastr.info(`已将预设 \"${configPresetName}\" 打包。`);\n                }\n                else {\n                    toastr.warning(`无法获取预设 \"${configPresetName}\" 的数据。`);\n                }\n            }\n        }\n        if (configData.regexStates && configData.regexStates.length > 0) {\n            const userChoice = await triggerSlash(`/popup okButton=\"是\" cancelButton=\"否\" result=true \"此配置绑定了正则。是否选择要一起导出的正则？\"`);\n            if (userChoice === '1') {\n                const boundRegexIds = new Set(configData.regexStates.map(r => r.id));\n                const allGlobalRegexes = await TavernHelper.getTavernRegexes({ scope: 'global' });\n                const boundRegexes = allGlobalRegexes.filter((r) => boundRegexIds.has(r.id));\n                const { showRegexExportSelectionPopup } = await Promise.resolve(/*! import() */).then(__webpack_require__.bind(__webpack_require__, /*! ./辅助弹窗功能 */ \"./src/喵喵预设配置管理/辅助弹窗功能.ts\"));\n                const selectedRegexes = await showRegexExportSelectionPopup(boundRegexes);\n                if (selectedRegexes) {\n                    exportBundle.regexData = selectedRegexes;\n                    toastr.info(`已将 ${selectedRegexes.length} 条正则打包导出。`);\n                }\n                else {\n                    toastr.info('已取消导出正则。');\n                }\n            }\n        }\n        // 检查是否包含分组配置\n        const groupingPresetName = configData.presetName;\n        if (groupingPresetName) {\n            const groupingConfig = (0,___WEBPACK_IMPORTED_MODULE_2__.exportPresetGrouping)(groupingPresetName);\n            if (groupingConfig) {\n                const includeGroupingChoice = await triggerSlash(`/popup okButton=\"是\" cancelButton=\"否\" result=true \"预设 \\\\\"${groupingPresetName}\\\\\" 包含条目分组设置。是否要一起导出？\"`);\n                if (includeGroupingChoice === '1') {\n                    exportBundle.groupingConfig = groupingConfig;\n                    toastr.info('已将分组设置打包导出。');\n                }\n            }\n        }\n        const defaultFileName = `${configName}_bundle`;\n        let userFileName = await triggerSlash(`/input default=\"${defaultFileName}\" \"请输入导出的文件名（无需后缀）\"`);\n        if (!userFileName || userFileName.trim() === '') {\n            userFileName = defaultFileName;\n            toastr.info('文件名为空，已使用默认名称。');\n        }\n        userFileName = userFileName.trim().replace(/\\.json$/, '');\n        const jsonString = JSON.stringify(exportBundle, null, 2);\n        (0,downloadjs__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(jsonString, `${userFileName}.json`, 'text/plain');\n        toastr.success(`配置包 \"${configName}\" 已导出。`);\n    }\n    catch (error) {\n        console.error('导出配置失败:', error);\n        toastr.error('导出配置失败，请检查控制台获取更多信息。');\n    }\n}\nasync function handleFileImport(event) {\n    const file = event.target.files[0];\n    if (!file)\n        return;\n    const reader = new FileReader();\n    reader.onload = async (e) => {\n        try {\n            const content = e.target?.result;\n            const parsedContent = JSON.parse(content);\n            if (parsedContent.entries && typeof parsedContent.entries === 'object') {\n                toastr.info('检测到世界书备份文件。');\n                const configsToImport = [];\n                for (const entry of Object.values(parsedContent.entries)) {\n                    if (entry.content) {\n                        try {\n                            const config = JSON.parse(entry.content);\n                            if (config.id && config.name && Array.isArray(config.states)) {\n                                configsToImport.push(config);\n                            }\n                        }\n                        catch (err) {\n                            // 忽略解析失败的条目\n                        }\n                    }\n                }\n                if (configsToImport.length > 0) {\n                    const { startBatchImportFlow } = await Promise.resolve(/*! import() */).then(__webpack_require__.bind(__webpack_require__, /*! ./批量操作功能 */ \"./src/喵喵预设配置管理/批量操作功能.ts\"));\n                    await startBatchImportFlow(configsToImport);\n                }\n                else {\n                    toastr.warning('世界书文件中未找到有效的喵喵配置数据。');\n                }\n                return;\n            }\n            if (parsedContent.remark) {\n                const { showRemarkPopup } = await Promise.resolve(/*! import() */).then(__webpack_require__.bind(__webpack_require__, /*! ./辅助弹窗功能 */ \"./src/喵喵预设配置管理/辅助弹窗功能.ts\"));\n                await showRemarkPopup(parsedContent.remark);\n            }\n            if (parsedContent.type === 'MiaoMiaoPresetMegaBundle') {\n                const { handleMegaBundleImport } = await Promise.resolve(/*! import() */).then(__webpack_require__.bind(__webpack_require__, /*! ./批量操作功能 */ \"./src/喵喵预设配置管理/批量操作功能.ts\"));\n                await handleMegaBundleImport(parsedContent);\n                return;\n            }\n            let configToImport, presetToImport, regexToImport, groupingToImport;\n            if (parsedContent.type === 'MiaoMiaoPresetBundle') {\n                console.log('检测到整合包文件，版本:', parsedContent.version);\n                toastr.info('检测到整合包文件。');\n                configToImport = parsedContent.presetConfig;\n                presetToImport = parsedContent.presetData;\n                regexToImport = parsedContent.regexData;\n                groupingToImport = parsedContent.groupingConfig;\n                console.log('分组配置:', groupingToImport);\n            }\n            else {\n                configToImport = parsedContent;\n            }\n            if (!configToImport || typeof configToImport.presetName !== 'string' || !Array.isArray(configToImport.states)) {\n                toastr.error('导入失败：配置数据格式不正确。');\n                return;\n            }\n            if (presetToImport) {\n                const importPresetChoice = await triggerSlash(`/popup okButton=\"是\" cancelButton=\"否\" result=true \"此文件包含预设文件 \\\\\"${presetToImport.name}\\\\\"。是否导入/覆盖？\"`);\n                if (importPresetChoice === '1') {\n                    await TavernHelper.createOrReplacePreset(presetToImport.name, presetToImport);\n                    toastr.success(`预设文件 \"${presetToImport.name}\" 已导入。`);\n                }\n            }\n            if (regexToImport && regexToImport.length > 0) {\n                await (0,___WEBPACK_IMPORTED_MODULE_3__.importRegexLogic)(regexToImport);\n            }\n            // 处理分组配置导入\n            if (groupingToImport && Array.isArray(groupingToImport) && groupingToImport.length > 0) {\n                if (configToImport.presetName) {\n                    try {\n                        console.log('导入分组配置:', groupingToImport);\n                        (0,___WEBPACK_IMPORTED_MODULE_2__.importPresetGrouping)(configToImport.presetName, groupingToImport);\n                        toastr.success('已成功导入并应用分组设置到预设。');\n                    }\n                    catch (error) {\n                        console.error('导入分组配置失败:', error);\n                        toastr.error('导入分组配置失败：' + error.message);\n                    }\n                }\n                else {\n                    console.warn('配置中没有预设名称，无法导入分组配置');\n                }\n            }\n            const initialName = configToImport.name || file.name.replace(/_bundle\\.json$/i, '').replace(/\\.json$/i, '');\n            let configName = await triggerSlash(`/input default=\"${initialName}\" \"请输入导入配置的名称\"`);\n            configName = configName.trim();\n            if (!configName) {\n                toastr.info('导入已取消。');\n                return;\n            }\n            const configs = await (0,___WEBPACK_IMPORTED_MODULE_4__.getStoredConfigs)();\n            configToImport.name = configName;\n            configToImport.id = (0,___WEBPACK_IMPORTED_MODULE_1__.generateUniqueId)(); // Always generate new ID for single import\n            configs[configToImport.id] = configToImport;\n            await (0,___WEBPACK_IMPORTED_MODULE_4__.setStoredConfigs)(configs);\n            toastr.success(`配置 \"${configName}\" 已成功导入。`);\n            await (0,___WEBPACK_IMPORTED_MODULE_4__.renderConfigsList)();\n        }\n        catch (error) {\n            console.error('导入文件失败:', error);\n            toastr.error('导入文件失败，请检查控制台获取更多信息。');\n        }\n        finally {\n            $(event.target).val('');\n        }\n    };\n    reader.readAsText(file);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMv5Za15Za16aKE6K6+6YWN572u566h55CGL+WvvOWFpeWvvOWHuuWKn+iDvS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQWtDO0FBQ1U7QUFDdUM7QUFDdkM7QUFDc0M7QUFFM0UsS0FBSyxVQUFVLFlBQVksQ0FBQyxRQUFnQjtJQUNqRCxJQUFJLENBQUM7UUFDSCxNQUFNLE9BQU8sR0FBRyxNQUFNLG1EQUFnQixFQUFFLENBQUM7UUFDekMsTUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRXJDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUNoQixNQUFNLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQzVCLE9BQU87UUFDVCxDQUFDO1FBQ0QsTUFBTSxVQUFVLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQztRQUVuQyxJQUFJLFVBQVUsR0FBRyxFQUFFLENBQUM7UUFDcEIsTUFBTSxlQUFlLEdBQUcsTUFBTSxZQUFZLENBQ3hDLG1FQUFtRSxDQUNwRSxDQUFDO1FBQ0YsSUFBSSxlQUFlLEtBQUssR0FBRyxFQUFFLENBQUM7WUFDNUIsVUFBVSxHQUFHLE1BQU0sWUFBWSxDQUM3QixnRUFBZ0UsQ0FDakUsQ0FBQztRQUNKLENBQUM7UUFFRCxNQUFNLFlBQVksR0FBRztZQUNuQixJQUFJLEVBQUUsc0JBQXNCO1lBQzVCLE9BQU8sRUFBRSxDQUFDO1lBQ1YsTUFBTSxFQUFFLFVBQVUsSUFBSSxFQUFFO1lBQ3hCLFlBQVksRUFBRSxVQUFVO1lBQ3hCLFVBQVUsRUFBRSxJQUFJO1lBQ2hCLFNBQVMsRUFBRSxJQUFJO1lBQ2YsY0FBYyxFQUFFLElBQUk7U0FDckIsQ0FBQztRQUVGLE1BQU0sZ0JBQWdCLEdBQUcsVUFBVSxDQUFDLFVBQVUsQ0FBQztRQUMvQyxJQUFJLGdCQUFnQixJQUFJLFlBQVksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxDQUFDO1lBQ2pGLE1BQU0sbUJB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cm5faGVscGVyX3RlbXBsYXRlLy4vc3JjL+WWteWWtemihOiuvumFjee9rueuoeeQhi/lr7zlhaXlr7zlh7rlip/og70udHM/Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBkb3dubG9hZCBmcm9tICdkb3dubG9hZGpzJztcbmltcG9ydCB7IGdlbmVyYXRlVW5pcXVlSWQgfSBmcm9tICcuL+WIneWni+WMluWSjOmFjee9ric7XG5pbXBvcnQgeyBleHBvcnRQcmVzZXRHcm91cGluZywgaW1wb3J0UHJlc2V0R3JvdXBpbmcsIFByb21wdEdyb3VwIH0gZnJvbSAnLi/mnaHnm67liIbnu4Tlip/og70nO1xuaW1wb3J0IHsgaW1wb3J0UmVnZXhMb2dpYyB9IGZyb20gJy4v5q2j5YiZ57uR5a6a5Yqf6IO9JztcbmltcG9ydCB7IGdldFN0b3JlZENvbmZpZ3MsIHJlbmRlckNvbmZpZ3NMaXN0LCBzZXRTdG9yZWRDb25maWdzIH0gZnJvbSAnLi/phY3nva7lrZjlgqjlkozor7vlj5YnO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZXhwb3J0Q29uZmlnKGNvbmZpZ0lkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBjb25maWdzID0gYXdhaXQgZ2V0U3RvcmVkQ29uZmlncygpO1xuICAgIGNvbnN0IGNvbmZpZ0RhdGEgPSBjb25maWdzW2NvbmZpZ0lkXTtcblxuICAgIGlmICghY29uZmlnRGF0YSkge1xuICAgICAgdG9hc3RyLmVycm9yKGDphY3nva7kuI3lrZjlnKjvvIzml6Dms5Xlr7zlh7rjgIJgKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgY29uZmlnTmFtZSA9IGNvbmZpZ0RhdGEubmFtZTtcblxuICAgIGxldCB1c2VyUmVtYXJrID0gJyc7XG4gICAgY29uc3QgYWRkUmVtYXJrQ2hvaWNlID0gYXdhaXQgdHJpZ2dlclNsYXNoKFxuICAgICAgYC9wb3B1cCBva0J1dHRvbj1cIuaYr1wiIGNhbmNlbEJ1dHRvbj1cIuWQplwiIHJlc3VsdD10cnVlIFwi5piv5ZCm6KaB5Li65q2k5a+85Ye65re75Yqg5aSH5rOo5L+h5oGv77yfXCJgLFxuICAgICk7XG4gICAgaWYgKGFkZFJlbWFya0Nob2ljZSA9PT0gJzEnKSB7XG4gICAgICB1c2VyUmVtYXJrID0gYXdhaXQgdHJpZ2dlclNsYXNoKFxuICAgICAgICBgL2lucHV0IG11bHRpbGluZT10cnVlIHBsYWNlaG9sZGVyPVwi6K+36L6T5YWl5aSH5rOo77yM5L6L5aaC6aKE6K6+55So6YCU44CB5p2l5rqQ562JLi4uXCIgXCLmt7vliqDlpIfms6hcImAsXG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbnN0IGV4cG9ydEJ1bmRsZSA9IHtcbiAgICAgIHR5cGU6ICdNaWFvTWlhb1ByZXNldEJ1bmRsZScsXG4gICAgICB2ZXJzaW9uOiAxLFxuICAgICAgcmVtYXJrOiB1c2VyUmVtYXJrIHx8ICcnLFxuICAgICAgcHJlc2V0Q29uZmlnOiBjb25maWdEYXRhLFxuICAgICAgcHJlc2V0RGF0YTogbnVsbCxcbiAgICAgIHJlZ2V4RGF0YTogbnVsbCxcbiAgICAgIGdyb3VwaW5nQ29uZmlnOiBudWxsLFxuICAgIH07XG5cbiAgICBjb25zdCBjb25maWdQcmVzZXROYW1lID0gY29uZmlnRGF0YS5wcmVzZXROYW1lO1xuICAgIGlmIChjb25maWdQcmVzZXROYW1lICYmIFRhdmVybkhlbHBlci5nZXRQcmVzZXROYW1lcygpLmluY2x1ZGVzKGNvbmZpZ1ByZXNldE5hbWUpKSB7XG4gICAgICBjb25zdCBpbmNsdWRlUHJlc2V0Q2hvaWNlID0gYXdhaXQgdHJpZ2dlclNsYXNoKFxuICAgICAgICBgL3BvcHVwIG9rQnV0dG9uPVwi5pivXCIgY2FuY2VsQnV0dG9uPVwi5ZCmXCIgcmVzdWx0PXRydWUgXCLmraTphY3nva7lhbPogZTkuobpooTorr4gXFxcXFwiJHtjb25maWdQcmVzZXROYW1lfVxcXFxcIuOAguaYr+WQpuimgeWwhumihOiuvuaWh+S7tuacrOi6q+S4gOi1t+aJk+WMheWvvOWHuu+8n1wiYCxcbiAgICAgICk7XG4gICAgICBpZiAoaW5jbHVkZVByZXNldENob2ljZSA9PT0gJzEnKSB7XG4gICAgICAgIGNvbnN0IHByZXNldERhdGEgPSBUYXZlcm5IZWxwZXIuZ2V0UHJlc2V0KGNvbmZpZ1ByZXNldE5hbWUpO1xuICAgICAgICBpZiAocHJlc2V0RGF0YSkge1xuICAgICAgICAgIChwcmVzZXREYXRhIGFzIGFueSkubmFtZSA9IGNvbmZpZ1ByZXNldE5hbWU7XG4gICAgICAgICAgKGV4cG9ydEJ1bmRsZSBhcyBhbnkpLnByZXNldERhdGEgPSBwcmVzZXREYXRhO1xuICAgICAgICAgIHRvYXN0ci5pbmZvKGDlt7LlsIbpooTorr4gXCIke2NvbmZpZ1ByZXNldE5hbWV9XCIg5omT5YyF44CCYCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdG9hc3RyLndhcm5pbmcoYOaXoOazleiOt+WPlumihOiuviBcIiR7Y29uZmlnUHJlc2V0TmFtZX1cIiDnmoTmlbDmja7jgIJgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChjb25maWdEYXRhLnJlZ2V4U3RhdGVzICYmIGNvbmZpZ0RhdGEucmVnZXhTdGF0ZXMubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgdXNlckNob2ljZSA9IGF3YWl0IHRyaWdnZXJTbGFzaChcbiAgICAgICAgYC9wb3B1cCBva0J1dHRvbj1cIuaYr1wiIGNhbmNlbEJ1dHRvbj1cIuWQplwiIHJlc3VsdD10cnVlIFwi5q2k6YWN572u57uR5a6a5LqG5q2j5YiZ44CC5piv5ZCm6YCJ5oup6KaB5LiA6LW35a+85Ye655qE5q2j5YiZ77yfXCJgLFxuICAgICAgKTtcbiAgICAgIGlmICh1c2VyQ2hvaWNlID09PSAnMScpIHtcbiAgICAgICAgY29uc3QgYm91bmRSZWdleElkcyA9IG5ldyBTZXQoY29uZmlnRGF0YS5yZWdleFN0YXRlcy5tYXAociA9PiByLmlkKSk7XG4gICAgICAgIGNvbnN0IGFsbEdsb2JhbFJlZ2V4ZXMgPSBhd2FpdCBUYXZlcm5IZWxwZXIuZ2V0VGF2ZXJuUmVnZXhlcyh7IHNjb3BlOiAnZ2xvYmFsJyB9KTtcbiAgICAgICAgY29uc3QgYm91bmRSZWdleGVzID0gYWxsR2xvYmFsUmVnZXhlcy5maWx0ZXIoKHI6IGFueSkgPT4gYm91bmRSZWdleElkcy5oYXMoci5pZCkpO1xuXG4gICAgICAgIGNvbnN0IHsgc2hvd1JlZ2V4RXhwb3J0U2VsZWN0aW9uUG9wdXAgfSA9IGF3YWl0IGltcG9ydCgnLi/ovoXliqnlvLnnqpflip/og70nKTtcbiAgICAgICAgY29uc3Qgc2VsZWN0ZWRSZWdleGVzID0gYXdhaXQgc2hvd1JlZ2V4RXhwb3J0U2VsZWN0aW9uUG9wdXAoYm91bmRSZWdleGVzKTtcblxuICAgICAgICBpZiAoc2VsZWN0ZWRSZWdleGVzKSB7XG4gICAgICAgICAgKGV4cG9ydEJ1bmRsZSBhcyBhbnkpLnJlZ2V4RGF0YSA9IHNlbGVjdGVkUmVnZXhlcztcbiAgICAgICAgICB0b2FzdHIuaW5mbyhg5bey5bCGICR7c2VsZWN0ZWRSZWdleGVzLmxlbmd0aH0g5p2h5q2j5YiZ5omT5YyF5a+85Ye644CCYCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdG9hc3RyLmluZm8oJ+W3suWPlua2iOWvvOWHuuato+WImeOAgicpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8g5qOA5p+l5piv5ZCm5YyF5ZCr5YiG57uE6YWN572uXG4gICAgY29uc3QgZ3JvdXBpbmdQcmVzZXROYW1lID0gY29uZmlnRGF0YS5wcmVzZXROYW1lO1xuICAgIGlmIChncm91cGluZ1ByZXNldE5hbWUpIHtcbiAgICAgIGNvbnN0IGdyb3VwaW5nQ29uZmlnID0gZXhwb3J0UHJlc2V0R3JvdXBpbmcoZ3JvdXBpbmdQcmVzZXROYW1lKTtcbiAgICAgIGlmIChncm91cGluZ0NvbmZpZykge1xuICAgICAgICBjb25zdCBpbmNsdWRlR3JvdXBpbmdDaG9pY2UgPSBhd2FpdCB0cmlnZ2VyU2xhc2goXG4gICAgICAgICAgYC9wb3B1cCBva0J1dHRvbj1cIuaYr1wiIGNhbmNlbEJ1dHRvbj1cIuWQplwiIHJlc3VsdD10cnVlIFwi6aKE6K6+IFxcXFxcIiR7Z3JvdXBpbmdQcmVzZXROYW1lfVxcXFxcIiDljIXlkKvmnaHnm67liIbnu4Torr7nva7jgILmmK/lkKbopoHkuIDotbflr7zlh7rvvJ9cImAsXG4gICAgICAgICk7XG4gICAgICAgIGlmIChpbmNsdWRlR3JvdXBpbmdDaG9pY2UgPT09ICcxJykge1xuICAgICAgICAgIChleHBvcnRCdW5kbGUgYXMgYW55KS5ncm91cGluZ0NvbmZpZyA9IGdyb3VwaW5nQ29uZmlnO1xuICAgICAgICAgIHRvYXN0ci5pbmZvKCflt7LlsIbliIbnu4Torr7nva7miZPljIXlr7zlh7rjgIInKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGRlZmF1bHRGaWxlTmFtZSA9IGAke2NvbmZpZ05hbWV9X2J1bmRsZWA7XG4gICAgbGV0IHVzZXJGaWxlTmFtZSA9IGF3YWl0IHRyaWdnZXJTbGFzaChgL2lucHV0IGRlZmF1bHQ9XCIke2RlZmF1bHRGaWxlTmFtZX1cIiBcIuivt+i+k+WFpeWvvOWHuueahOaWh+S7tuWQje+8iOaXoOmcgOWQjue8gO+8iVwiYCk7XG5cbiAgICBpZiAoIXVzZXJGaWxlTmFtZSB8fCB1c2VyRmlsZU5hbWUudHJpbSgpID09PSAnJykge1xuICAgICAgdXNlckZpbGVOYW1lID0gZGVmYXVsdEZpbGVOYW1lO1xuICAgICAgdG9hc3RyLmluZm8oJ+aWh+S7tuWQjeS4uuepuu+8jOW3suS9v+eUqOm7mOiupOWQjeensOOAgicpO1xuICAgIH1cbiAgICB1c2VyRmlsZU5hbWUgPSB1c2VyRmlsZU5hbWUudHJpbSgpLnJlcGxhY2UoL1xcLmpzb24kLywgJycpO1xuXG4gICAgY29uc3QganNvblN0cmluZyA9IEpTT04uc3RyaW5naWZ5KGV4cG9ydEJ1bmRsZSwgbnVsbCwgMik7XG4gICAgZG93bmxvYWQoanNvblN0cmluZywgYCR7dXNlckZpbGVOYW1lfS5qc29uYCwgJ3RleHQvcGxhaW4nKTtcblxuICAgIHRvYXN0ci5zdWNjZXNzKGDphY3nva7ljIUgXCIke2NvbmZpZ05hbWV9XCIg5bey5a+85Ye644CCYCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcign5a+85Ye66YWN572u5aSx6LSlOicsIGVycm9yKTtcbiAgICB0b2FzdHIuZXJyb3IoJ+WvvOWHuumFjee9ruWksei0pe+8jOivt+ajgOafpeaOp+WItuWPsOiOt+WPluabtOWkmuS/oeaBr+OAgicpO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBoYW5kbGVGaWxlSW1wb3J0KGV2ZW50OiBhbnkpOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgZmlsZSA9IGV2ZW50LnRhcmdldC5maWxlc1swXTtcbiAgaWYgKCFmaWxlKSByZXR1cm47XG5cbiAgY29uc3QgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcbiAgcmVhZGVyLm9ubG9hZCA9IGFzeW5jIGUgPT4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBjb250ZW50ID0gZS50YXJnZXQ/LnJlc3VsdCBhcyBzdHJpbmc7XG4gICAgICBjb25zdCBwYXJzZWRDb250ZW50ID0gSlNPTi5wYXJzZShjb250ZW50KTtcblxuICAgICAgaWYgKHBhcnNlZENvbnRlbnQuZW50cmllcyAmJiB0eXBlb2YgcGFyc2VkQ29udGVudC5lbnRyaWVzID09PSAnb2JqZWN0Jykge1xuICAgICAgICB0b2FzdHIuaW5mbygn5qOA5rWL5Yiw5LiW55WM5Lmm5aSH5Lu95paH5Lu244CCJyk7XG4gICAgICAgIGNvbnN0IGNvbmZpZ3NUb0ltcG9ydCA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIE9iamVjdC52YWx1ZXMocGFyc2VkQ29udGVudC5lbnRyaWVzKSkge1xuICAgICAgICAgIGlmICgoZW50cnkgYXMgYW55KS5jb250ZW50KSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBjb25zdCBjb25maWcgPSBKU09OLnBhcnNlKChlbnRyeSBhcyBhbnkpLmNvbnRlbnQpO1xuICAgICAgICAgICAgICBpZiAoY29uZmlnLmlkICYmIGNvbmZpZy5uYW1lICYmIEFycmF5LmlzQXJyYXkoY29uZmlnLnN0YXRlcykpIHtcbiAgICAgICAgICAgICAgICBjb25maWdzVG9JbXBvcnQucHVzaChjb25maWcpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgLy8g5b+955Wl6Kej5p6Q5aSx6LSl55qE5p2h55uuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChjb25maWdzVG9JbXBvcnQubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGNvbnN0IHsgc3RhcnRCYXRjaEltcG9ydEZsb3cgfSA9IGF3YWl0IGltcG9ydCgnLi/mibnph4/mk43kvZzlip/og70nKTtcbiAgICAgICAgICBhd2FpdCBzdGFydEJhdGNoSW1wb3J0Rmxvdyhjb25maWdzVG9JbXBvcnQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRvYXN0ci53YXJuaW5nKCfkuJbnlYzkuabmlofku7bkuK3mnKrmib7liLDmnInmlYjnmoTllrXllrXphY3nva7mlbDmja7jgIInKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChwYXJzZWRDb250ZW50LnJlbWFyaykge1xuICAgICAgICBjb25zdCB7IHNob3dSZW1hcmtQb3B1cCB9ID0gYXdhaXQgaW1wb3J0KCcuL+i+heWKqeW8ueeql+WKn+iDvScpO1xuICAgICAgICBhd2FpdCBzaG93UmVtYXJrUG9wdXAocGFyc2VkQ29udGVudC5yZW1hcmspO1xuICAgICAgfVxuXG4gICAgICBpZiAocGFyc2VkQ29udGVudC50eXBlID09PSAnTWlhb01pYW9QcmVzZXRNZWdhQnVuZGxlJykge1xuICAgICAgICBjb25zdCB7IGhhbmRsZU1lZ2FCdW5kbGVJbXBvcnQgfSA9IGF3YWl0IGltcG9ydCgnLi/mibnph4/mk43kvZzlip/og70nKTtcbiAgICAgICAgYXdhaXQgaGFuZGxlTWVnYUJ1bmRsZUltcG9ydChwYXJzZWRDb250ZW50KTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBsZXQgY29uZmlnVG9JbXBvcnQsIHByZXNldFRvSW1wb3J0LCByZWdleFRvSW1wb3J0LCBncm91cGluZ1RvSW1wb3J0O1xuXG4gICAgICBpZiAocGFyc2VkQ29udGVudC50eXBlID09PSAnTWlhb01pYW9QcmVzZXRCdW5kbGUnKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCfmo4DmtYvliLDmlbTlkIjljIXmlofku7bvvIzniYjmnKw6JywgcGFyc2VkQ29udGVudC52ZXJzaW9uKTtcbiAgICAgICAgdG9hc3RyLmluZm8oJ+ajgOa1i+WIsOaVtOWQiOWMheaWh+S7tuOAgicpO1xuICAgICAgICBjb25maWdUb0ltcG9ydCA9IHBhcnNlZENvbnRlbnQucHJlc2V0Q29uZmlnO1xuICAgICAgICBwcmVzZXRUb0ltcG9ydCA9IHBhcnNlZENvbnRlbnQucHJlc2V0RGF0YTtcbiAgICAgICAgcmVnZXhUb0ltcG9ydCA9IHBhcnNlZENvbnRlbnQucmVnZXhEYXRhO1xuICAgICAgICBncm91cGluZ1RvSW1wb3J0ID0gcGFyc2VkQ29udGVudC5ncm91cGluZ0NvbmZpZztcbiAgICAgICAgY29uc29sZS5sb2coJ+WIhue7hOmFjee9rjonLCBncm91cGluZ1RvSW1wb3J0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbmZpZ1RvSW1wb3J0ID0gcGFyc2VkQ29udGVudDtcbiAgICAgIH1cblxuICAgICAgaWYgKCFjb25maWdUb0ltcG9ydCB8fCB0eXBlb2YgY29uZmlnVG9JbXBvcnQucHJlc2V0TmFtZSAhPT0gJ3N0cmluZycgfHwgIUFycmF5LmlzQXJyYXkoY29uZmlnVG9JbXBvcnQuc3RhdGVzKSkge1xuICAgICAgICB0b2FzdHIuZXJyb3IoJ+WvvOWFpeWksei0pe+8mumFjee9ruaVsOaNruagvOW8j+S4jeato+ehruOAgicpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChwcmVzZXRUb0ltcG9ydCkge1xuICAgICAgICBjb25zdCBpbXBvcnRQcmVzZXRDaG9pY2UgPSBhd2FpdCB0cmlnZ2VyU2xhc2goXG4gICAgICAgICAgYC9wb3B1cCBva0J1dHRvbj1cIuaYr1wiIGNhbmNlbEJ1dHRvbj1cIuWQplwiIHJlc3VsdD10cnVlIFwi5q2k5paH5Lu25YyF5ZCr6aKE6K6+5paH5Lu2IFxcXFxcIiR7cHJlc2V0VG9JbXBvcnQubmFtZX1cXFxcXCLjgILmmK/lkKblr7zlhaUv6KaG55uW77yfXCJgLFxuICAgICAgICApO1xuICAgICAgICBpZiAoaW1wb3J0UHJlc2V0Q2hvaWNlID09PSAnMScpIHtcbiAgICAgICAgICBhd2FpdCBUYXZlcm5IZWxwZXIuY3JlYXRlT3JSZXBsYWNlUHJlc2V0KHByZXNldFRvSW1wb3J0Lm5hbWUsIHByZXNldFRvSW1wb3J0KTtcbiAgICAgICAgICB0b2FzdHIuc3VjY2Vzcyhg6aKE6K6+5paH5Lu2IFwiJHtwcmVzZXRUb0ltcG9ydC5uYW1lfVwiIOW3suWvvOWFpeOAgmApO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChyZWdleFRvSW1wb3J0ICYmIHJlZ2V4VG9JbXBvcnQubGVuZ3RoID4gMCkge1xuICAgICAgICBhd2FpdCBpbXBvcnRSZWdleExvZ2ljKHJlZ2V4VG9JbXBvcnQpO1xuICAgICAgfVxuXG4gICAgICAvLyDlpITnkIbliIbnu4TphY3nva7lr7zlhaVcbiAgICAgIGlmIChncm91cGluZ1RvSW1wb3J0ICYmIEFycmF5LmlzQXJyYXkoZ3JvdXBpbmdUb0ltcG9ydCkgJiYgZ3JvdXBpbmdUb0ltcG9ydC5sZW5ndGggPiAwKSB7XG4gICAgICAgIGlmIChjb25maWdUb0ltcG9ydC5wcmVzZXROYW1lKSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCflr7zlhaXliIbnu4TphY3nva46JywgZ3JvdXBpbmdUb0ltcG9ydCk7XG4gICAgICAgICAgICBpbXBvcnRQcmVzZXRHcm91cGluZyhjb25maWdUb0ltcG9ydC5wcmVzZXROYW1lLCBncm91cGluZ1RvSW1wb3J0IGFzIFByb21wdEdyb3VwW10pO1xuICAgICAgICAgICAgdG9hc3RyLnN1Y2Nlc3MoJ+W3suaIkOWKn+WvvOWFpeW5tuW6lOeUqOWIhue7hOiuvue9ruWIsOmihOiuvuOAgicpO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCflr7zlhaXliIbnu4TphY3nva7lpLHotKU6JywgZXJyb3IpO1xuICAgICAgICAgICAgdG9hc3RyLmVycm9yKCflr7zlhaXliIbnu4TphY3nva7lpLHotKXvvJonICsgKGVycm9yIGFzIEVycm9yKS5tZXNzYWdlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc29sZS53YXJuKCfphY3nva7kuK3msqHmnInpooTorr7lkI3np7DvvIzml6Dms5Xlr7zlhaXliIbnu4TphY3nva4nKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCBpbml0aWFsTmFtZSA9IGNvbmZpZ1RvSW1wb3J0Lm5hbWUgfHwgZmlsZS5uYW1lLnJlcGxhY2UoL19idW5kbGVcXC5qc29uJC9pLCAnJykucmVwbGFjZSgvXFwuanNvbiQvaSwgJycpO1xuICAgICAgbGV0IGNvbmZpZ05hbWUgPSBhd2FpdCB0cmlnZ2VyU2xhc2goYC9pbnB1dCBkZWZhdWx0PVwiJHtpbml0aWFsTmFtZX1cIiBcIuivt+i+k+WFpeWvvOWFpemFjee9rueahOWQjeensFwiYCk7XG4gICAgICBjb25maWdOYW1lID0gY29uZmlnTmFtZS50cmltKCk7XG4gICAgICBpZiAoIWNvbmZpZ05hbWUpIHtcbiAgICAgICAgdG9hc3RyLmluZm8oJ+WvvOWFpeW3suWPlua2iOOAgicpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGNvbmZpZ3MgPSBhd2FpdCBnZXRTdG9yZWRDb25maWdzKCk7XG4gICAgICBjb25maWdUb0ltcG9ydC5uYW1lID0gY29uZmlnTmFtZTtcbiAgICAgIGNvbmZpZ1RvSW1wb3J0LmlkID0gZ2VuZXJhdGVVbmlxdWVJZCgpOyAvLyBBbHdheXMgZ2VuZXJhdGUgbmV3IElEIGZvciBzaW5nbGUgaW1wb3J0XG4gICAgICBjb25maWdzW2NvbmZpZ1RvSW1wb3J0LmlkXSA9IGNvbmZpZ1RvSW1wb3J0O1xuICAgICAgYXdhaXQgc2V0U3RvcmVkQ29uZmlncyhjb25maWdzKTtcblxuICAgICAgdG9hc3RyLnN1Y2Nlc3MoYOmFjee9riBcIiR7Y29uZmlnTmFtZX1cIiDlt7LmiJDlip/lr7zlhaXjgIJgKTtcbiAgICAgIGF3YWl0IHJlbmRlckNvbmZpZ3NMaXN0KCk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ+WvvOWFpeaWh+S7tuWksei0pTonLCBlcnJvcik7XG4gICAgICB0b2FzdHIuZXJyb3IoJ+WvvOWFpeaWh+S7tuWksei0pe+8jOivt+ajgOafpeaOp+WItuWPsOiOt+WPluabtOWkmuS/oeaBr+OAgicpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICAkKGV2ZW50LnRhcmdldCkudmFsKCcnKTtcbiAgICB9XG4gIH07XG4gIHJlYWRlci5yZWFkQXNUZXh0KGZpbGUpO1xufVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/喵喵预设配置管理/导入导出功能.ts\n\n}");

/***/ }),

/***/ 65:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   P: () => (/* binding */ importRegexLogic),
/* harmony export */   showRegexBindingPopup: () => (/* binding */ showRegexBindingPopup)
/* harmony export */ });
/* unused harmony export sortRegexes */
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(780);
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(320);


async function showRegexBindingPopup(configId) {
    const popupId = 'preset-manager-regex-popup';
    $(`#${popupId}`).remove();
    try {
        const allRegexes = await TavernHelper.getTavernRegexes({ scope: 'global' });
        if (allRegexes.length === 0) {
            toastr.info('没有可绑定的全局正则。');
            return;
        }
        const configs = await (0,___WEBPACK_IMPORTED_MODULE_1__.getStoredConfigs)();
        const currentConfig = configs[configId];
        if (!currentConfig)
            return;
        const savedStates = new Map(currentConfig.regexStates?.map(r => [r.id, r.enabled]) ?? []);
        const regexesHtml = allRegexes
            .map((regex) => {
            const isChecked = savedStates.has(regex.id) ? savedStates.get(regex.id) : regex.enabled;
            const safeName = $('<div/>').text(regex.script_name).html();
            return `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 5px; border-bottom: 1px solid #eee;">
                    <label for="regex-toggle-${regex.id}" style="cursor: pointer; flex: 1; margin-right: 10px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${safeName}">${safeName}</label>
                    <label class="pm-switch">
                       <input type="checkbox" id="regex-toggle-${regex.id}" data-id="${regex.id}" ${isChecked ? 'checked' : ''}/>
                       <span class="pm-slider"></span>
                    </label>
                </div>
            `;
        })
            .join('');
        const popupHtml = `
            <div id="${popupId}" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: 10001; display: flex; align-items: center; justify-content: center;">
                <div style="background-color: #fff8f0; color: #3a2c2c; border-radius: 16px; padding: 20px; width: 90%; max-width: 450px; box-shadow: 0 4px 25px rgba(120,90,60,.25); display: flex; flex-direction: column; max-height: 80vh;">
                    <h4 style="margin-top:0; color:#c62828; text-align: center;">请选择绑定正则</h4>
                    <div style="flex: 1; min-height: 0; overflow-y: auto; margin: 15px 0; border-top: 1px solid #f0e2d0; border-bottom: 1px solid #f0e2d0; padding: 5px 10px;">
                        ${regexesHtml}
                    </div>
                    <div style="text-align: right; display:flex; justify-content:flex-end; gap: 10px;">
                        <button id="regex-bind-clear" style="padding: 8px 16px; background-color:#f5a8a0; border:none; border-radius:6px; cursor:pointer; color:#fff;">清除绑定</button>
                        <button id="regex-bind-cancel" style="padding: 8px 16px; background-color:#e0e0e0; border:none; border-radius:6px; cursor:pointer; color:#333;">取消</button>
                        <button id="regex-bind-save" style="padding: 8px 16px; background-color:#f4c78e; border:none; border-radius:6px; cursor:pointer; font-weight:bold; color:#3a2c2c;">保存</button>
                    </div>
                </div>
            </div>
        `;
        $('body').append(popupHtml);
        const mobileStyles = `<style>@media (max-width: 600px) { #${popupId} { align-items: flex-start !important; } #${popupId} > div { margin-top: 5vh; } }</style>`;
        $(`#${popupId}`).append(mobileStyles);
        $('#regex-bind-cancel').on('click', () => $(`#${popupId}`).remove());
        $('#regex-bind-clear').on('click', async () => {
            const configs = await (0,___WEBPACK_IMPORTED_MODULE_1__.getStoredConfigs)();
            if (configs[configId] && configs[configId].regexStates) {
                delete configs[configId].regexStates;
                await (0,___WEBPACK_IMPORTED_MODULE_1__/* .setStoredConfigs */ .BR)(configs);
                toastr.success(`配置 "${configs[configId].name}" 的正则绑定已清除。`);
            }
            else {
                toastr.info(`配置没有正则绑定。`);
            }
            $(`#${popupId}`).remove();
            (0,___WEBPACK_IMPORTED_MODULE_1__/* .renderConfigsList */ .sd)();
        });
        $('#regex-bind-save').on('click', async () => {
            const newRegexStates = allRegexes.map((regex) => ({
                id: regex.id,
                enabled: $(`#regex-toggle-${regex.id}`).is(':checked'),
            }));
            const configs = await (0,___WEBPACK_IMPORTED_MODULE_1__.getStoredConfigs)();
            if (!configs[configId])
                return;
            configs[configId].regexStates = newRegexStates;
            await (0,___WEBPACK_IMPORTED_MODULE_1__/* .setStoredConfigs */ .BR)(configs);
            toastr.success(`配置 "${configs[configId].name}" 的正则绑定已保存。`);
            $(`#${popupId}`).remove();
            (0,___WEBPACK_IMPORTED_MODULE_1__/* .renderConfigsList */ .sd)();
            const currentPresetName = configs[configId].presetName;
            if (!currentPresetName)
                return;
            const otherConfigIds = Object.keys(configs).filter(id => id !== configId && configs[id].presetName === currentPresetName);
            if (otherConfigIds.length > 0) {
                const confirmMessage = `是否要将此正则绑定应用到其他使用预设 "${currentPresetName}" 的 ${otherConfigIds.length} 个配置上？`;
                const userChoice = await triggerSlash(`/popup okButton="应用" cancelButton="取消" result=true "${confirmMessage}"`);
                if (userChoice === '1') {
                    otherConfigIds.forEach(id => {
                        configs[id].regexStates = newRegexStates;
                    });
                    await (0,___WEBPACK_IMPORTED_MODULE_1__/* .setStoredConfigs */ .BR)(configs);
                    toastr.success(`已成功将正则绑定应用到 ${otherConfigIds.length} 个同名预设配置上。`);
                }
            }
        });
    }
    catch (error) {
        console.error('打开正则绑定界面失败:', error);
        toastr.error('无法加载全局正则列表。');
    }
}
function sortRegexes(regexes) {
    const getSortNumber = (name) => {
        const match = name.trim().match(/^(?:\[|【|\(|（)?(\d+)(?:\]|】|\)|）|\.|-|_|\s)?/);
        if (match && match[1]) {
            return parseInt(match[1], 10);
        }
        return Infinity;
    };
    return regexes.sort((a, b) => {
        const numA = getSortNumber(a.script_name);
        const numB = getSortNumber(b.script_name);
        if (numA !== numB) {
            return numA - numB;
        }
        return a.script_name.localeCompare(b.script_name);
    });
}
async function importRegexLogic(regexToImport) {
    const currentRegexes = await TavernHelper.getTavernRegexes({ scope: 'global' });
    let remainingRegexes = currentRegexes;
    if (currentRegexes && currentRegexes.length > 0) {
        remainingRegexes = await (0,___WEBPACK_IMPORTED_MODULE_0__/* .showRegexDeletionPopup */ .rb)(currentRegexes);
    }
    const combinedRegexes = [...regexToImport, ...remainingRegexes];
    const sortedRegexes = sortRegexes(combinedRegexes);
    await TavernHelper.replaceTavernRegexes(sortedRegexes, { scope: 'global' });
    toastr.success(`成功导入 ${regexToImport.length} 条正则，并重新排序。`);
}


/***/ }),

/***/ 291:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   handleMegaBundleImport: () => (/* binding */ handleMegaBundleImport),\n/* harmony export */   showBatchDeletePopup: () => (/* binding */ showBatchDeletePopup),\n/* harmony export */   showBatchExportPopup: () => (/* binding */ showBatchExportPopup),\n/* harmony export */   startBatchImportFlow: () => (/* binding */ startBatchImportFlow)\n/* harmony export */ });\n/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./初始化和配置 */ \"./src/喵喵预设配置管理/初始化和配置.ts\");\n/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./正则绑定功能 */ \"./src/喵喵预设配置管理/正则绑定功能.ts\");\n/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./辅助弹窗功能 */ \"./src/喵喵预设配置管理/辅助弹窗功能.ts\");\n/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./配置存储和读取 */ \"./src/喵喵预设配置管理/配置存储和读取.ts\");\n\n\n\n\nasync function showBatchExportPopup() {\n    const popupId = 'preset-manager-batch-export-popup';\n    $(`#${popupId}`).remove();\n    const configs = Object.values(await (0,___WEBPACK_IMPORTED_MODULE_3__.getStoredConfigs)());\n    if (configs.length === 0) {\n        toastr.info('没有可导出的配置。');\n        return;\n    }\n    const configsHtml = configs\n        .map(config => {\n        const safeName = $('<div/>').text(config.name).html();\n        return `\n            <div style=\"padding: 8px 5px; border-bottom: 1px solid #eee; display: flex; align-items: center;\">\n                <label style=\"cursor:pointer; display:flex; align-items:center; width: 100%;\">\n                    <input type=\"checkbox\" class=\"pm-batch-export-item\" value=\"${config.id}\" style=\"margin-right: 10px; transform: scale(1.2);\">\n                    <span>${safeName}</span>\n                </label>\n            </div>\n        `;\n    })\n        .join('');\n    const popupHtml = `\n        <div id=\"${popupId}\" style=\"position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: 10001; display: flex; align-items: center; justify-content: center;\">\n            <div style=\"background-color: #fff8f0; color: #3a2c2c; border-radius: 16px; padding: 20px; width: 90%; max-width: 450px; box-shadow: 0 4px 25px rgba(120,90,60,.25); display: flex; flex-direction: column; max-height: 80vh;\">\n                <h4 style=\"margin-top:0; color:#6a4226; text-align: center;\">选择要批量导出的配置</h4>\n                <div style=\"margin: 10px 0; display: flex; justify-content: space-around;\">\n                   <button id=\"batch-export-select-all\" style=\"padding: 6px 12px; background-color:#a5d6f9; border:none; border-radius:6px; cursor:pointer;\">全选</button>\n                   <button id=\"batch-export-deselect-all\" style=\"padding: 6px 12px; background-color:#e0e0e0; border:none; border-radius:6px; cursor:pointer;\">全不选</button>\n                </div>\n                <div style=\"flex: 1; min-height: 0; overflow-y: auto; margin-bottom: 20px; border-top: 1px solid #f0e2d0; border-bottom: 1px solid #f0e2d0; padding: 5px 10px;\">\n                    ${configsHtml}\n                </div>\n                <div style=\"text-align: right; display:flex; justify-content:flex-end; gap: 10px;\">\n                    <button id=\"batch-export-cancel\" style=\"padding: 8px 16px; background-color:#e0e0e0; border:none; border-radius:6px; cursor:pointer; color:#333;\">取消</button>\n                    <button id=\"batch-export-confirm\" style=\"padding: 8px 16px; background-color:#f4c78e; border:none; border-radius:6px; cursor:pointer; font-weight:bold; color:#3a2c2c;\">确认导出</button>\n                </div>\n            </div>\n        </div>\n    `;\n    $('body').append(popupHtml);\n    const mobileStyles = `<style>\n        @media (max-width: 600px) { #${popupId} > div { margin-top: 5vh; } }\n    </style>`;\n    $(`#${popupId}`).append(mobileStyles);\n    $('#batch-export-select-all').on('click', () => $('.pm-batch-export-item').prop('checked', true));\n    $('#batch-export-deselect-all').on('click', () => $('.pm-batch-export-item').prop('checked', false));\n    $('#batch-export-cancel').on('click', () => $(`#${popupId}`).remove());\n    $('#batch-export-confirm').on('click', async () => {\n        const selectedIds = new Set();\n        $('.pm-batch-export-item:checked').each(function () {\n            selectedIds.add($(this).val());\n        });\n        const allConfigs = await (0,___WEBPACK_IMPORTED_MODULE_3__.getStoredConfigs)();\n        const selectedConfigs = Object.values(allConfigs).filter(c => selectedIds.has(c.id));\n        batchExportConfigs(selectedConfigs);\n        $(`#${popupId}`).remove();\n    });\n}\nasync function batchExportConfigs(selectedConfigs) {\n    if (selectedConfigs.length === 0) {\n        toastr.info('未选择任何配置。');\n        return;\n    }\n    try {\n        let userRemark = '';\n        const addRemarkChoice = await triggerSlash(`/popup okButton=\"是\" cancelButton=\"否\" result=true \"是否要为这个批量导出的整合包添加备注信息？\"`);\n        if (addRemarkChoice === '1') {\n            userRemark = await triggerSlash(`/input multiline=true placeholder=\"请输入备注，例如这批配置的共同特点...\" \"为整合包添加备注\"`);\n        }\n        const megaBundle = {\n            type: 'MiaoMiaoPresetMegaBundle',\n            version: 1,\n            remark: userRemark || '',\n            presetConfigs: {},\n            presets: {},\n            regexData: [],\n        };\n        const uniquePresetNames = new Set();\n        for (const configData of selectedConfigs) {\n            megaBundle.presetConfigs[configData.id] = configData;\n            if (configData.presetName) {\n                uniquePresetNames.add(configData.presetName);\n            }\n        }\n        if (uniquePresetNames.size > 0) {\n            const presetList = Array.from(uniquePresetNames).join(', ');\n            const includePresetsChoice = await triggerSlash(`/popup okButton=\"是\" cancelButton=\"否\" result=true \"您选择的配置关联了以下预设：${presetList}。是否要将这些预设文件一同打包导出？\"`);\n            if (includePresetsChoice === '1') {\n                let includedCount = 0;\n                for (const presetName of uniquePresetNames) {\n                    if (TavernHelper.getPresetNames().includes(presetName)) {\n                        const presetData = TavernHelper.getPreset(presetName);\n                        if (presetData) {\n                            megaBundle.presets[presetName] = presetData;\n                            includedCount++;\n                        }\n                    }\n                }\n                toastr.info(`已将 ${includedCount} 个预设文件打包。`);\n            }\n            else {\n                toastr.info('跳过预设文件导出。');\n            }\n        }\n        const includeRegexChoice = await triggerSlash(`/popup okButton=\"是\" cancelButton=\"否\" result=true \"是否需要选择一些全局正则脚本一同打包导出？\"`);\n        if (includeRegexChoice === '1') {\n            const allGlobalRegexes = await TavernHelper.getTavernRegexes({ scope: 'global' });\n            if (allGlobalRegexes.length === 0) {\n                toastr.info('没有可供导出的全局正则脚本。');\n            }\n            else {\n                const selectedRegexes = await (0,___WEBPACK_IMPORTED_MODULE_2__.showRegexExportSelectionPopup)(allGlobalRegexes);\n                if (selectedRegexes) {\n                    megaBundle.regexData = selectedRegexes;\n                    toastr.info(`已将 ${selectedRegexes.length} 条正则打包。`);\n                }\n                else {\n                    toastr.info('已取消选择正则，将不导出任何正则脚本。');\n                }\n            }\n        }\n        else {\n            toastr.info('跳过正则导出。');\n        }\n        const defaultFileName = 'MiaoMiao_Batch_Export';\n        let userFileName = await triggerSlash(`/input default=\"${defaultFileName}\" \"请输入批量导出的文件名（无需后缀）\"`);\n        if (!userFileName || userFileName.trim() === '') {\n            userFileName = defaultFileName;\n            toastr.info('文件名为空，已使用默认名称。');\n        }\n        userFileName = userFileName.trim().replace(/\\.json$/, '');\n        const jsonString = JSON.stringify(megaBundle, null, 2);\n        const blob = new Blob([jsonString], { type: 'application/json' });\n        const url = URL.createObjectURL(blob);\n        const a = document.createElement('a');\n        a.href = url;\n        a.download = `${userFileName}.json`;\n        document.body.appendChild(a);\n        a.click();\n        URL.revokeObjectURL(url);\n        a.remove();\n        toastr.success(`已成功导出 ${selectedConfigs.length} 个配置的整合包。`);\n    }\n    catch (error) {\n        console.error('批量导出失败:', error);\n        toastr.error('批量导出失败，请检查控制台。');\n    }\n}\nasync function startBatchImportFlow(configsToImport) {\n    const userChoices = await (0,___WEBPACK_IMPORTED_MODULE_2__.showBatchImportConfigSelectionPopup)(configsToImport);\n    if (!userChoices) {\n        toastr.info('配置导入已取消。');\n        return;\n    }\n    const importList = userChoices.filter((choice) => choice.import);\n    if (importList.length === 0) {\n        toastr.info('未选择要导入的配置。');\n        return;\n    }\n    const storedConfigs = await (0,___WEBPACK_IMPORTED_MODULE_3__.getStoredConfigs)();\n    importList.forEach((choice) => {\n        const config = configsToImport.find(c => c.id === choice.originalId);\n        if (config) {\n            const newConfig = { ...config }; // Create a copy\n            newConfig.name = choice.newName;\n            newConfig.id = (0,___WEBPACK_IMPORTED_MODULE_0__.generateUniqueId)(); // Assign a new unique ID on import\n            storedConfigs[newConfig.id] = newConfig;\n        }\n    });\n    await (0,___WEBPACK_IMPORTED_MODULE_3__.setStoredConfigs)(storedConfigs);\n    toastr.success(`成功导入 ${importList.length} 个配置。`);\n    await (0,___WEBPACK_IMPORTED_MODULE_3__.renderConfigsList)();\n}\nasync function handleMegaBundleImport(megaBundle) {\n    // 1. 导入预设\n    const presetsToImport = megaBundle.presets;\n    if (presetsToImport && Object.keys(presetsToImport).length > 0) {\n        const presetNames = Object.keys(presetsToImport).join(', ');\n        const importPresetChoice = await triggerSlash(`/popup okButton=\"是\" cancelButton=\"否\" result=true \"此文件包含预设: ${presetNames}。是否全部导入/覆盖？\"`);\n        if (importPresetChoice === '1') {\n            for (const presetName in presetsToImport) {\n                await TavernHelper.createOrReplacePreset(presetName, presetsToImport[presetName]);\n            }\n            toastr.success(`已导入 ${Object.keys(presetsToImport).length} 个预设。`);\n        }\n    }\n    // 2. 导入正则\n    const regexToImport = megaBundle.regexData;\n    if (regexToImport && regexToImport.length > 0) {\n        const importRegexChoice = await triggerSlash(`/popup okButton=\"是\" cancelButton=\"否\" result=true \"此文件包含 ${regexToImport.length} 条正则脚本。是否导入？\"`);\n        if (importRegexChoice === '1') {\n            await (0,___WEBPACK_IMPORTED_MODULE_1__.importRegexLogic)(regexToImport);\n        }\n    }\n    // 3. 导入配置\n    const configsToImport = Object.values(megaBundle.presetConfigs);\n    await startBatchImportFlow(configsToImport);\n}\nasync function showBatchDeletePopup() {\n    const popupId = 'preset-manager-batch-delete-popup';\n    $(`#${popupId}`).remove();\n    const configs = Object.values(await (0,___WEBPACK_IMPORTED_MODULE_3__.getStoredConfigs)());\n    if (configs.length === 0) {\n        toastr.info('没有可删除的配置。');\n        return;\n    }\n    const configsHtml = configs\n        .map(config => {\n        const safeName = $('<div/>').text(config.name).html();\n        return `\n            <div style=\"padding: 8px 5px; border-bottom: 1px solid #eee; display: flex; align-items: center;\">\n                <label style=\"cursor:pointer; display:flex; align-items:center; width: 100%;\">\n                    <input type=\"checkbox\" class=\"pm-batch-delete-item\" value=\"${config.id}\" style=\"margin-right: 10px; transform: scale(1.2);\">\n                    <span title=\"${safeName}\">${safeName}</span>\n                </label>\n            </div>\n        `;\n    })\n        .join('');\n    const popupHtml = `\n        <div id=\"${popupId}\" style=\"position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: 10001; display: flex; align-items: center; justify-content: center;\">\n            <div style=\"background-color: #fff8f0; color: #3a2c2c; border-radius: 16px; padding: 20px; width: 90%; max-width: 450px; box-shadow: 0 4px 25px rgba(120,90,60,.25); display: flex; flex-direction: column; max-height: 80vh;\">\n                <h4 style=\"margin-top:0; color:#c62828; text-align: center;\">选择要批量删除的配置</h4>\n                <div style=\"margin: 10px 0; display: flex; justify-content: space-around;\">\n                   <button id=\"batch-delete-select-all\" style=\"padding: 6px 12px; background-color:#a5d6f9; border:none; border-radius:6px; cursor:pointer;\">全选</button>\n                   <button id=\"batch-delete-deselect-all\" style=\"padding: 6px 12px; background-color:#e0e0e0; border:none; border-radius:6px; cursor:pointer;\">全不选</button>\n                </div>\n                <div style=\"flex: 1; min-height: 0; overflow-y: auto; margin-bottom: 20px; border-top: 1px solid #f0e2d0; border-bottom: 1px solid #f0e2d0; padding: 5px 10px;\">\n                    ${configsHtml}\n                </div>\n                <div style=\"text-align: right; display:flex; justify-content:flex-end; gap: 10px;\">\n                    <button id=\"batch-delete-cancel\" style=\"padding: 8px 16px; background-color:#e0e0e0; border:none; border-radius:6px; cursor:pointer; color:#333;\">取消</button>\n                    <button id=\"batch-delete-confirm\" style=\"padding: 8px 16px; background-color:#f44336; border:none; border-radius:6px; cursor:pointer; font-weight:bold; color:#fff;\">确认删除</button>\n                </div>\n            </div>\n        </div>\n    `;\n    $('body').append(popupHtml);\n    const mobileStyles = `<style>@media (max-width: 600px) { #${popupId} { align-items: flex-start !important; } #${popupId} > div { margin-top: 200px; } }</style>`;\n    $(`#${popupId}`).append(mobileStyles);\n    $('#batch-delete-select-all').on('click', () => $('.pm-batch-delete-item').prop('checked', true));\n    $('#batch-delete-deselect-all').on('click', () => $('.pm-batch-delete-item').prop('checked', false));\n    $('#batch-delete-cancel').on('click', () => $(`#${popupId}`).remove());\n    $('#batch-delete-confirm').on('click', () => {\n        const selectedIds = [];\n        $('.pm-batch-delete-item:checked').each(function () {\n            selectedIds.push($(this).val());\n        });\n        batchDeleteConfigs(selectedIds);\n        $(`#${popupId}`).remove();\n    });\n}\nasync function batchDeleteConfigs(configIds) {\n    if (configIds.length === 0) {\n        toastr.info('未选择任何要删除的配置。');\n        return;\n    }\n    const confirm = await triggerSlash(`/popup okButton=\"确认删除\" cancelButton=\"取消\" result=true \"警告：您确定要删除选中的 ${configIds.length} 个配置吗？此操作无法撤销。\"`);\n    if (confirm !== '1') {\n        toastr.info('批量删除操作已取消。');\n        return;\n    }\n    try {\n        const storedConfigs = await (0,___WEBPACK_IMPORTED_MODULE_3__.getStoredConfigs)();\n        const idsToDelete = new Set(configIds);\n        Object.keys(storedConfigs).forEach(id => {\n            if (idsToDelete.has(id))\n                delete storedConfigs[id];\n        });\n        await (0,___WEBPACK_IMPORTED_MODULE_3__.setStoredConfigs)(storedConfigs);\n        toastr.success(`已成功删除 ${configIds.length} 个配置。`);\n        await (0,___WEBPACK_IMPORTED_MODULE_3__.renderConfigsList)();\n    }\n    catch (error) {\n        console.error('批量删除失败:', error);\n        toastr.error('批量删除失败，请检查控制台。');\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMv5Za15Za16aKE6K6+6YWN572u566h55CGL+aJuemHj+aTjeS9nOWKn+iDvS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUE0QztBQUNBO0FBQ2tEO0FBQ0E7QUFFdkYsS0FBSyxVQUFVLG9CQUFvQjtJQUN4QyxNQUFNLE9BQU8sR0FBRyxtQ0FBbUMsQ0FBQztJQUNwRCxDQUFDLENBQUMsSUFBSSxPQUFPLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBRTFCLE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxtREFBZ0IsRUFBRSxDQUFDLENBQUM7SUFFeEQsSUFBSSxPQUFPLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRSxDQUFDO1FBQ3pCLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDekIsT0FBTztJQUNULENBQUM7SUFFRCxNQUFNLFdBQVcsR0FBRyxPQUFPO1NBQ3hCLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRTtRQUNaLE1BQU0sUUFBUSxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3RELE9BQU87OztpRkFHb0UsTUFBTSxDQUFDLEVBQUU7NEJBQzlELFFBQVE7OztTQUczQixDQUFDO0lBQ04sQ0FBQyxDQUFDO1NBQ0QsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBRVosTUFBTSxTQUFTLEdBQUc7bUJBQ0QsT0FBTzs7Ozs7Ozs7c0JBUUosV0FBVzs7Ozs7Ozs7S0FRNUIsQ0FBQztJQUVKLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7SUFFNUIsTUFBTSxZQUFZLEdBQUc7dUNBQ2dCLE9BQU87YUFDakMsQ0FBQztJQUNaLENBQUMsQ0FBQyxJQUFJLE9BQU8sRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBRXRD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QUUsT0FBTyxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDcEQsQ0FBQyxDQUFDLENBQUM7UUFDSCxNQUFNLG1EQUFnQixDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ3RDLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxTQUFTLENBQUMsTUFBTSxPQUFPLENBQUMsQ0FBQztRQUNqRCxNQUFNLG9EQUFpQixFQUFFLENBQUM7SUFDNUIsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDZixPQUFPLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNoQyxNQUFNLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLENBQUM7SUFDakMsQ0FBQztBQUNILENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90YXZlcm5faGVscGVyX3RlbXBsYXRlLy4vc3JjL+WWteWWtemihOiuvumFjee9rueuoeeQhi/mibnph4/mk43kvZzlip/og70udHM/Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGdlbmVyYXRlVW5pcXVlSWQgfSBmcm9tICcuL+WIneWni+WMluWSjOmFjee9ric7XG5pbXBvcnQgeyBpbXBvcnRSZWdleExvZ2ljIH0gZnJvbSAnLi/mraPliJnnu5Hlrprlip/og70nO1xuaW1wb3J0IHsgc2hvd0JhdGNoSW1wb3J0Q29uZmlnU2VsZWN0aW9uUG9wdXAsIHNob3dSZWdleEV4cG9ydFNlbGVjdGlvblBvcHVwIH0gZnJvbSAnLi/ovoXliqnlvLnnqpflip/og70nO1xuaW1wb3J0IHsgQ29uZmlnRGF0YSwgZ2V0U3RvcmVkQ29uZmlncywgcmVuZGVyQ29uZmlnc0xpc3QsIHNldFN0b3JlZENvbmZpZ3MgfSBmcm9tICcuL+mFjee9ruWtmOWCqOWSjOivu+WPlic7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzaG93QmF0Y2hFeHBvcnRQb3B1cCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgcG9wdXBJZCA9ICdwcmVzZXQtbWFuYWdlci1iYXRjaC1leHBvcnQtcG9wdXAnO1xuICAkKGAjJHtwb3B1cElkfWApLnJlbW92ZSgpO1xuXG4gIGNvbnN0IGNvbmZpZ3MgPSBPYmplY3QudmFsdWVzKGF3YWl0IGdldFN0b3JlZENvbmZpZ3MoKSk7XG5cbiAgaWYgKGNvbmZpZ3MubGVuZ3RoID09PSAwKSB7XG4gICAgdG9hc3RyLmluZm8oJ+ayoeacieWPr+WvvOWHuueahOmFjee9ruOAgicpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IGNvbmZpZ3NIdG1sID0gY29uZmlnc1xuICAgIC5tYXAoY29uZmlnID0+IHtcbiAgICAgIGNvbnN0IHNhZmVOYW1lID0gJCgnPGRpdi8+JykudGV4dChjb25maWcubmFtZSkuaHRtbCgpO1xuICAgICAgcmV0dXJuIGBcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJwYWRkaW5nOiA4cHggNXB4OyBib3JkZXItYm90dG9tOiAxcHggc29saWQgI2VlZTsgZGlzcGxheTogZmxleDsgYWxpZ24taXRlbXM6IGNlbnRlcjtcIj5cbiAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9XCJjdXJzb3I6cG9pbnRlcjsgZGlzcGxheTpmbGV4OyBhbGlnbi1pdGVtczpjZW50ZXI7IHdpZHRoOiAxMDAlO1wiPlxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgY2xhc3M9XCJwbS1iYXRjaC1leHBvcnQtaXRlbVwiIHZhbHVlPVwiJHtjb25maWcuaWR9XCIgc3R5bGU9XCJtYXJnaW4tcmlnaHQ6IDEwcHg7IHRyYW5zZm9ybTogc2NhbGUoMS4yKTtcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4+JHtzYWZlTmFtZX08L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICBgO1xuICAgIH0pXG4gICAgLmpvaW4oJycpO1xuXG4gIGNvbnN0IHBvcHVwSHRtbCA9IGBcbiAgICAgICAgPGRpdiBpZD1cIiR7cG9wdXBJZH1cIiBzdHlsZT1cInBvc2l0aW9uOiBmaXhlZDsgdG9wOiAwOyBsZWZ0OiAwOyB3aWR0aDogMTAwJTsgaGVpZ2h0OiAxMDAlOyBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsMCwwLDAuNSk7IHotaW5kZXg6IDEwMDAxOyBkaXNwbGF5OiBmbGV4OyBhbGlnbi1pdGVtczogY2VudGVyOyBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcIj5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmOGYwOyBjb2xvcjogIzNhMmMyYzsgYm9yZGVyLXJhZGl1czogMTZweDsgcGFkZGluZzogMjBweDsgd2lkdGg6IDkwJTsgbWF4LXdpZHRoOiA0NTBweDsgYm94LXNoYWRvdzogMCA0cHggMjVweCByZ2JhKDEyMCw5MCw2MCwuMjUpOyBkaXNwbGF5OiBmbGV4OyBmbGV4LWRpcmVjdGlvbjogY29sdW1uOyBtYXgtaGVpZ2h0OiA4MHZoO1wiPlxuICAgICAgICAgICAgICAgIDxoNCBzdHlsZT1cIm1hcmdpbi10b3A6MDsgY29sb3I6IzZhNDIyNjsgdGV4dC1hbGlnbjogY2VudGVyO1wiPumAieaLqeimgeaJuemHj+WvvOWHuueahOmFjee9rjwvaDQ+XG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cIm1hcmdpbjogMTBweCAwOyBkaXNwbGF5OiBmbGV4OyBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcIj5cbiAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGlkPVwiYmF0Y2gtZXhwb3J0LXNlbGVjdC1hbGxcIiBzdHlsZT1cInBhZGRpbmc6IDZweCAxMnB4OyBiYWNrZ3JvdW5kLWNvbG9yOiNhNWQ2Zjk7IGJvcmRlcjpub25lOyBib3JkZXItcmFkaXVzOjZweDsgY3Vyc29yOnBvaW50ZXI7XCI+5YWo6YCJPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cImJhdGNoLWV4cG9ydC1kZXNlbGVjdC1hbGxcIiBzdHlsZT1cInBhZGRpbmc6IDZweCAxMnB4OyBiYWNrZ3JvdW5kLWNvbG9yOiNlMGUwZTA7IGJvcmRlcjpub25lOyBib3JkZXItcmFkaXVzOjZweDsgY3Vyc29yOnBvaW50ZXI7XCI+5YWo5LiN6YCJPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cImZsZXg6IDE7IG1pbi1oZWlnaHQ6IDA7IG92ZXJmbG93LXk6IGF1dG87IG1hcmdpbi1ib3R0b206IDIwcHg7IGJvcmRlci10b3A6IDFweCBzb2xpZCAjZjBlMmQwOyBib3JkZXItYm90dG9tOiAxcHggc29saWQgI2YwZTJkMDsgcGFkZGluZzogNXB4IDEwcHg7XCI+XG4gICAgICAgICAgICAgICAgICAgICR7Y29uZmlnc0h0bWx9XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cInRleHQtYWxpZ246IHJpZ2h0OyBkaXNwbGF5OmZsZXg7IGp1c3RpZnktY29udGVudDpmbGV4LWVuZDsgZ2FwOiAxMHB4O1wiPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGlkPVwiYmF0Y2gtZXhwb3J0LWNhbmNlbFwiIHN0eWxlPVwicGFkZGluZzogOHB4IDE2cHg7IGJhY2tncm91bmQtY29sb3I6I2UwZTBlMDsgYm9yZGVyOm5vbmU7IGJvcmRlci1yYWRpdXM6NnB4OyBjdXJzb3I6cG9pbnRlcjsgY29sb3I6IzMzMztcIj7lj5bmtog8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cImJhdGNoLWV4cG9ydC1jb25maXJtXCIgc3R5bGU9XCJwYWRkaW5nOiA4cHggMTZweDsgYmFja2dyb3VuZC1jb2xvcjojZjRjNzhlOyBib3JkZXI6bm9uZTsgYm9yZGVyLXJhZGl1czo2cHg7IGN1cnNvcjpwb2ludGVyOyBmb250LXdlaWdodDpib2xkOyBjb2xvcjojM2EyYzJjO1wiPuehruiupOWvvOWHujwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgIGA7XG5cbiAgJCgnYm9keScpLmFwcGVuZChwb3B1cEh0bWwpO1xuXG4gIGNvbnN0IG1vYmlsZVN0eWxlcyA9IGA8c3R5bGU+XG4gICAgICAgIEBtZWRpYSAobWF4LXdpZHRoOiA2MDBweCkgeyAjJHtwb3B1cElkfSA+IGRpdiB7IG1hcmdpbi10b3A6IDV2aDsgfSB9XG4gICAgPC9zdHlsZT5gO1xuICAkKGAjJHtwb3B1cElkfWApLmFwcGVuZChtb2JpbGVTdHlsZXMpO1xuXG4gICQoJyNiYXRjaC1leHBvcnQtc2VsZWN0LWFsbCcpLm9uKCdjbGljaycsICgpID0+ICQoJy5wbS1iYXRjaC1leHBvcnQtaXRlbScpLnByb3AoJ2NoZWNrZWQnLCB0cnVlKSk7XG4gICQoJyNiYXRjaC1leHBvcnQtZGVzZWxlY3QtYWxsJykub24oJ2NsaWNrJywgKCkgPT4gJCgnLnBtLWJhdGNoLWV4cG9ydC1pdGVtJykucHJvcCgnY2hlY2tlZCcsIGZhbHNlKSk7XG4gICQoJyNiYXRjaC1leHBvcnQtY2FuY2VsJykub24oJ2NsaWNrJywgKCkgPT4gJChgIyR7cG9wdXBJZH1gKS5yZW1vdmUoKSk7XG4gICQoJyNiYXRjaC1leHBvcnQtY29uZmlybScpLm9uKCdjbGljaycsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBzZWxlY3RlZElkcyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgICQoJy5wbS1iYXRjaC1leHBvcnQtaXRlbTpjaGVja2VkJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICBzZWxlY3RlZElkcy5hZGQoJCh0aGlzKS52YWwoKSBhcyBzdHJpbmcpO1xuICAgIH0pO1xuICAgIGNvbnN0IGFsbENvbmZpZ3MgPSBhd2FpdCBnZXRTdG9yZWRDb25maWdzKCk7XG4gICAgY29uc3Qgc2VsZWN0ZWRDb25maWdzID0gT2JqZWN0LnZhbHVlcyhhbGxDb25maWdzKS5maWx0ZXIoYyA9PiBzZWxlY3RlZElkcy5oYXMoYy5pZCkpO1xuICAgIGJhdGNoRXhwb3J0Q29uZmlncyhzZWxlY3RlZENvbmZpZ3MpO1xuICAgICQoYCMke3BvcHVwSWR9YCkucmVtb3ZlKCk7XG4gIH0pO1xufVxuXG5hc3luYyBmdW5jdGlvbiBiYXRjaEV4cG9ydENvbmZpZ3Moc2VsZWN0ZWRDb25maWdzOiBDb25maWdEYXRhW10pOiBQcm9taXNlPHZvaWQ+IHtcbiAgaWYgKHNlbGVjdGVkQ29uZmlncy5sZW5ndGggPT09IDApIHtcbiAgICB0b2FzdHIuaW5mbygn5pyq6YCJ5oup5Lu75L2V6YWN572u44CCJyk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdHJ5IHtcbiAgICBsZXQgdXNlclJlbWFyayA9ICcnO1xuICAgIGNvbnN0IGFkZFJlbWFya0Nob2ljZSA9IGF3YWl0IHRyaWdnZXJTbGFzaChcbiAgICAgIGAvcG9wdXAgb2tCdXR0b249XCLmmK9cIiBjYW5jZWxCdXR0b249XCLlkKZcIiByZXN1bHQ9dHJ1ZSBcIuaYr+WQpuimgeS4uui/meS4quaJuemHj+WvvOWHuueahOaVtOWQiOWMhea3u+WKoOWkh+azqOS/oeaBr++8n1wiYCxcbiAgICApO1xuICAgIGlmIChhZGRSZW1hcmtDaG9pY2UgPT09ICcxJykge1xuICAgICAgdXNlclJlbWFyayA9IGF3YWl0IHRyaWdnZXJTbGFzaChcbiAgICAgICAgYC9pbnB1dCBtdWx0aWxpbmU9dHJ1ZSBwbGFjZWhvbGRlcj1cIuivt+i+k+WFpeWkh+azqO+8jOS+i+Wmgui/meaJuemFjee9rueahOWFseWQjOeJueeCuS4uLlwiIFwi5Li65pW05ZCI5YyF5re75Yqg5aSH5rOoXCJgLFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBjb25zdCBtZWdhQnVuZGxlID0ge1xuICAgICAgdHlwZTogJ01pYW9NaWFvUHJlc2V0TWVnYUJ1bmRsZScsXG4gICAgICB2ZXJzaW9uOiAxLFxuICAgICAgcmVtYXJrOiB1c2VyUmVtYXJrIHx8ICcnLFxuICAgICAgcHJlc2V0Q29uZmlnczoge30gYXMgUmVjb3JkPHN0cmluZywgQ29uZmlnRGF0YT4sXG4gICAgICBwcmVzZXRzOiB7fSBhcyBSZWNvcmQ8c3RyaW5nLCBhbnk+LFxuICAgICAgcmVnZXhEYXRhOiBbXSBhcyBhbnlbXSxcbiAgICB9O1xuXG4gICAgY29uc3QgdW5pcXVlUHJlc2V0TmFtZXMgPSBuZXcgU2V0PHN0cmluZz4oKTtcblxuICAgIGZvciAoY29uc3QgY29uZmlnRGF0YSBvZiBzZWxlY3RlZENvbmZpZ3MpIHtcbiAgICAgIG1lZ2FCdW5kbGUucHJlc2V0Q29uZmlnc1tjb25maWdEYXRhLmlkXSA9IGNvbmZpZ0RhdGE7XG4gICAgICBpZiAoY29uZmlnRGF0YS5wcmVzZXROYW1lKSB7XG4gICAgICAgIHVuaXF1ZVByZXNldE5hbWVzLmFkZChjb25maWdEYXRhLnByZXNldE5hbWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh1bmlxdWVQcmVzZXROYW1lcy5zaXplID4gMCkge1xuICAgICAgY29uc3QgcHJlc2V0TGlzdCA9IEFycmF5LmZyb20odW5pcXVlUHJlc2V0TmFtZXMpLmpvaW4oJywgJyk7XG4gICAgICBjb25zdCBpbmNsdWRlUHJlc2V0c0Nob2ljZSA9IGF3YWl0IHRyaWdnZXJTbGFzaChcbiAgICAgICAgYC9wb3B1cCBva0J1dHRvbj1cIuaYr1wiIGNhbmNlbEJ1dHRvbj1cIuWQplwiIHJlc3VsdD10cnVlIFwi5oKo6YCJ5oup55qE6YWN572u5YWz6IGU5LqG5Lul5LiL6aKE6K6+77yaJHtwcmVzZXRMaXN0feOAguaYr+WQpuimgeWwhui/meS6m+mihOiuvuaWh+S7tuS4gOWQjOaJk+WMheWvvOWHuu+8n1wiYCxcbiAgICAgICk7XG4gICAgICBpZiAoaW5jbHVkZVByZXNldHNDaG9pY2UgPT09ICcxJykge1xuICAgICAgICBsZXQgaW5jbHVkZWRDb3VudCA9IDA7XG4gICAgICAgIGZvciAoY29uc3QgcHJlc2V0TmFtZSBvZiB1bmlxdWVQcmVzZXROYW1lcykge1xuICAgICAgICAgIGlmIChUYXZlcm5IZWxwZXIuZ2V0UHJlc2V0TmFtZXMoKS5pbmNsdWRlcyhwcmVzZXROYW1lKSkge1xuICAgICAgICAgICAgY29uc3QgcHJlc2V0RGF0YSA9IFRhdmVybkhlbHBlci5nZXRQcmVzZXQocHJlc2V0TmFtZSk7XG4gICAgICAgICAgICBpZiAocHJlc2V0RGF0YSkge1xuICAgICAgICAgICAgICBtZWdhQnVuZGxlLnByZXNldHNbcHJlc2V0TmFtZV0gPSBwcmVzZXREYXRhO1xuICAgICAgICAgICAgICBpbmNsdWRlZENvdW50Kys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRvYXN0ci5pbmZvKGDlt7LlsIYgJHtpbmNsdWRlZENvdW50fSDkuKrpooTorr7mlofku7bmiZPljIXjgIJgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRvYXN0ci5pbmZvKCfot7Pov4fpooTorr7mlofku7blr7zlh7rjgIInKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBpbmNsdWRlUmVnZXhDaG9pY2UgPSBhd2FpdCB0cmlnZ2VyU2xhc2goXG4gICAgICBgL3BvcHVwIG9rQnV0dG9uPVwi5pivXCIgY2FuY2VsQnV0dG9uPVwi5ZCmXCIgcmVzdWx0PXRydWUgXCLmmK/lkKbpnIDopoHpgInmi6nkuIDkupvlhajlsYDmraPliJnohJrmnKzkuIDlkIzmiZPljIXlr7zlh7rvvJ9cImAsXG4gICAgKTtcbiAgICBpZiAoaW5jbHVkZVJlZ2V4Q2hvaWNlID09PSAnMScpIHtcbiAgICAgIGNvbnN0IGFsbEdsb2JhbFJlZ2V4ZXMgPSBhd2FpdCBUYXZlcm5IZWxwZXIuZ2V0VGF2ZXJuUmVnZXhlcyh7IHNjb3BlOiAnZ2xvYmFsJyB9KTtcbiAgICAgIGlmIChhbGxHbG9iYWxSZWdleGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICB0b2FzdHIuaW5mbygn5rKh5pyJ5Y+v5L6b5a+85Ye655qE5YWo5bGA5q2j5YiZ6ISa5pys44CCJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBzZWxlY3RlZFJlZ2V4ZXMgPSBhd2FpdCBzaG93UmVnZXhFeHBvcnRTZWxlY3Rpb25Qb3B1cChhbGxHbG9iYWxSZWdleGVzKTtcbiAgICAgICAgaWYgKHNlbGVjdGVkUmVnZXhlcykge1xuICAgICAgICAgIG1lZ2FCdW5kbGUucmVnZXhEYXRhID0gc2VsZWN0ZWRSZWdleGVzO1xuICAgICAgICAgIHRvYXN0ci5pbmZvKGDlt7LlsIYgJHtzZWxlY3RlZFJlZ2V4ZXMubGVuZ3RofSDmnaHmraPliJnmiZPljIXjgIJgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0b2FzdHIuaW5mbygn5bey5Y+W5raI6YCJ5oup5q2j5YiZ77yM5bCG5LiN5a+85Ye65Lu75L2V5q2j5YiZ6ISa5pys44CCJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdG9hc3RyLmluZm8oJ+i3s+i/h+ato+WImeWvvOWHuuOAgicpO1xuICAgIH1cblxuICAgIGNvbnN0IGRlZmF1bHRGaWxlTmFtZSA9ICdNaWFvTWlhb19CYXRjaF9FeHBvcnQnO1xuICAgIGxldCB1c2VyRmlsZU5hbWUgPSBhd2FpdCB0cmlnZ2VyU2xhc2goYC9pbnB1dCBkZWZhdWx0PVwiJHtkZWZhdWx0RmlsZU5hbWV9XCIgXCLor7fovpPlhaXmibnph4/lr7zlh7rnmoTmlofku7blkI3vvIjml6DpnIDlkI7nvIDvvIlcImApO1xuXG4gICAgaWYgKCF1c2VyRmlsZU5hbWUgfHwgdXNlckZpbGVOYW1lLnRyaW0oKSA9PT0gJycpIHtcbiAgICAgIHVzZXJGaWxlTmFtZSA9IGRlZmF1bHRGaWxlTmFtZTtcbiAgICAgIHRvYXN0ci5pbmZvKCfmlofku7blkI3kuLrnqbrvvIzlt7Lkvb/nlKjpu5jorqTlkI3np7DjgIInKTtcbiAgICB9XG4gICAgdXNlckZpbGVOYW1lID0gdXNlckZpbGVOYW1lLnRyaW0oKS5yZXBsYWNlKC9cXC5qc29uJC8sICcnKTtcblxuICAgIGNvbnN0IGpzb25TdHJpbmcgPSBKU09OLnN0cmluZ2lmeShtZWdhQnVuZGxlLCBudWxsLCAyKTtcbiAgICBjb25zdCBibG9iID0gbmV3IEJsb2IoW2pzb25TdHJpbmddLCB7IHR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJyB9KTtcbiAgICBjb25zdCB1cmwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xuXG4gICAgY29uc3QgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICBhLmhyZWYgPSB1cmw7XG4gICAgYS5kb3dubG9hZCA9IGAke3VzZXJGaWxlTmFtZX0uanNvbmA7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChhKTtcbiAgICBhLmNsaWNrKCk7XG4gICAgVVJMLnJldm9rZU9iamVjdFVSTCh1cmwpO1xuICAgIGEucmVtb3ZlKCk7XG5cbiAgICB0b2FzdHIuc3VjY2Vzcyhg5bey5oiQ5Yqf5a+85Ye6ICR7c2VsZWN0ZWRDb25maWdzLmxlbmd0aH0g5Liq6YWN572u55qE5pW05ZCI5YyF44CCYCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcign5om56YeP5a+85Ye65aSx6LSlOicsIGVycm9yKTtcbiAgICB0b2FzdHIuZXJyb3IoJ+aJuemHj+WvvOWHuuWksei0pe+8jOivt+ajgOafpeaOp+WItuWPsOOAgicpO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzdGFydEJhdGNoSW1wb3J0Rmxvdyhjb25maWdzVG9JbXBvcnQ6IENvbmZpZ0RhdGFbXSk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCB1c2VyQ2hvaWNlcyA9IGF3YWl0IHNob3dCYXRjaEltcG9ydENvbmZpZ1NlbGVjdGlvblBvcHVwKGNvbmZpZ3NUb0ltcG9ydCk7XG5cbiAgaWYgKCF1c2VyQ2hvaWNlcykge1xuICAgIHRvYXN0ci5pbmZvKCfphY3nva7lr7zlhaXlt7Llj5bmtojjgIInKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBpbXBvcnRMaXN0ID0gdXNlckNob2ljZXMuZmlsdGVyKChjaG9pY2U6IGFueSkgPT4gY2hvaWNlLmltcG9ydCk7XG4gIGlmIChpbXBvcnRMaXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgIHRvYXN0ci5pbmZvKCfmnKrpgInmi6nopoHlr7zlhaXnmoTphY3nva7jgIInKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBzdG9yZWRDb25maWdzID0gYXdhaXQgZ2V0U3RvcmVkQ29uZmlncygpO1xuICBpbXBvcnRMaXN0LmZvckVhY2goKGNob2ljZTogYW55KSA9PiB7XG4gICAgY29uc3QgY29uZmlnID0gY29uZmlnc1RvSW1wb3J0LmZpbmQoYyA9PiBjLmlkID09PSBjaG9pY2Uub3JpZ2luYWxJZCk7XG4gICAgaWYgKGNvbmZpZykge1xuICAgICAgY29uc3QgbmV3Q29uZmlnID0geyAuLi5jb25maWcgfTsgLy8gQ3JlYXRlIGEgY29weVxuICAgICAgbmV3Q29uZmlnLm5hbWUgPSBjaG9pY2UubmV3TmFtZTtcbiAgICAgIG5ld0NvbmZpZy5pZCA9IGdlbmVyYXRlVW5pcXVlSWQoKTsgLy8gQXNzaWduIGEgbmV3IHVuaXF1ZSBJRCBvbiBpbXBvcnRcbiAgICAgIHN0b3JlZENvbmZpZ3NbbmV3Q29uZmlnLmlkXSA9IG5ld0NvbmZpZztcbiAgICB9XG4gIH0pO1xuXG4gIGF3YWl0IHNldFN0b3JlZENvbmZpZ3Moc3RvcmVkQ29uZmlncyk7XG4gIHRvYXN0ci5zdWNjZXNzKGDmiJDlip/lr7zlhaUgJHtpbXBvcnRMaXN0Lmxlbmd0aH0g5Liq6YWN572u44CCYCk7XG4gIGF3YWl0IHJlbmRlckNvbmZpZ3NMaXN0KCk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBoYW5kbGVNZWdhQnVuZGxlSW1wb3J0KG1lZ2FCdW5kbGU6IGFueSk6IFByb21pc2U8dm9pZD4ge1xuICAvLyAxLiDlr7zlhaXpooTorr5cbiAgY29uc3QgcHJlc2V0c1RvSW1wb3J0ID0gbWVnYUJ1bmRsZS5wcmVzZXRzO1xuICBpZiAocHJlc2V0c1RvSW1wb3J0ICYmIE9iamVjdC5rZXlzKHByZXNldHNUb0ltcG9ydCkubGVuZ3RoID4gMCkge1xuICAgIGNvbnN0IHByZXNldE5hbWVzID0gT2JqZWN0LmtleXMocHJlc2V0c1RvSW1wb3J0KS5qb2luKCcsICcpO1xuICAgIGNvbnN0IGltcG9ydFByZXNldENob2ljZSA9IGF3YWl0IHRyaWdnZXJTbGFzaChcbiAgICAgIGAvcG9wdXAgb2tCdXR0b249XCLmmK9cIiBjYW5jZWxCdXR0b249XCLlkKZcIiByZXN1bHQ9dHJ1ZSBcIuatpOaWh+S7tuWMheWQq+mihOiuvjogJHtwcmVzZXROYW1lc33jgILmmK/lkKblhajpg6jlr7zlhaUv6KaG55uW77yfXCJgLFxuICAgICk7XG4gICAgaWYgKGltcG9ydFByZXNldENob2ljZSA9PT0gJzEnKSB7XG4gICAgICBmb3IgKGNvbnN0IHByZXNldE5hbWUgaW4gcHJlc2V0c1RvSW1wb3J0KSB7XG4gICAgICAgIGF3YWl0IFRhdmVybkhlbHBlci5jcmVhdGVPclJlcGxhY2VQcmVzZXQocHJlc2V0TmFtZSwgcHJlc2V0c1RvSW1wb3J0W3ByZXNldE5hbWVdKTtcbiAgICAgIH1cbiAgICAgIHRvYXN0ci5zdWNjZXNzKGDlt7Llr7zlhaUgJHtPYmplY3Qua2V5cyhwcmVzZXRzVG9JbXBvcnQpLmxlbmd0aH0g5Liq6aKE6K6+44CCYCk7XG4gICAgfVxuICB9XG5cbiAgLy8gMi4g5a+85YWl5q2j5YiZXG4gIGNvbnN0IHJlZ2V4VG9JbXBvcnQgPSBtZWdhQnVuZGxlLnJlZ2V4RGF0YTtcbiAgaWYgKHJlZ2V4VG9JbXBvcnQgJiYgcmVnZXhUb0ltcG9ydC5sZW5ndGggPiAwKSB7XG4gICAgY29uc3QgaW1wb3J0UmVnZXhDaG9pY2UgPSBhd2FpdCB0cmlnZ2VyU2xhc2goXG4gICAgICBgL3BvcHVwIG9rQnV0dG9uPVwi5pivXCIgY2FuY2VsQnV0dG9uPVwi5ZCmXCIgcmVzdWx0PXRydWUgXCLmraTmlofku7bljIXlkKsgJHtyZWdleFRvSW1wb3J0Lmxlbmd0aH0g5p2h5q2j5YiZ6ISa5pys44CC5piv5ZCm5a+85YWl77yfXCJgLFxuICAgICk7XG4gICAgaWYgKGltcG9ydFJlZ2V4Q2hvaWNlID09PSAnMScpIHtcbiAgICAgIGF3YWl0IGltcG9ydFJlZ2V4TG9naWMocmVnZXhUb0ltcG9ydCk7XG4gICAgfVxuICB9XG5cbiAgLy8gMy4g5a+85YWl6YWN572uXG4gIGNvbnN0IGNvbmZpZ3NUb0ltcG9ydCA9IE9iamVjdC52YWx1ZXMobWVnYUJ1bmRsZS5wcmVzZXRDb25maWdzKTtcbiAgYXdhaXQgc3RhcnRCYXRjaEltcG9ydEZsb3coY29uZmlnc1RvSW1wb3J0KTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNob3dCYXRjaERlbGV0ZVBvcHVwKCk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBwb3B1cElkID0gJ3ByZXNldC1tYW5hZ2VyLWJhdGNoLWRlbGV0ZS1wb3B1cCc7XG4gICQoYCMke3BvcHVwSWR9YCkucmVtb3ZlKCk7XG5cbiAgY29uc3QgY29uZmlncyA9IE9iamVjdC52YWx1ZXMoYXdhaXQgZ2V0U3RvcmVkQ29uZmlncygpKTtcbiAgaWYgKGNvbmZpZ3MubGVuZ3RoID09PSAwKSB7XG4gICAgdG9hc3RyLmluZm8oJ+ayoeacieWPr+WIoOmZpOeahOmFjee9ruOAgicpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IGNvbmZpZ3NIdG1sID0gY29uZmlnc1xuICAgIC5tYXAoY29uZmlnID0+IHtcbiAgICAgIGNvbnN0IHNhZmVOYW1lID0gJCgnPGRpdi8+JykudGV4dChjb25maWcubmFtZSkuaHRtbCgpO1xuICAgICAgcmV0dXJuIGBcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJwYWRkaW5nOiA4cHggNXB4OyBib3JkZXItYm90dG9tOiAxcHggc29saWQgI2VlZTsgZGlzcGxheTogZmxleDsgYWxpZ24taXRlbXM6IGNlbnRlcjtcIj5cbiAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9XCJjdXJzb3I6cG9pbnRlcjsgZGlzcGxheTpmbGV4OyBhbGlnbi1pdGVtczpjZW50ZXI7IHdpZHRoOiAxMDAlO1wiPlxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgY2xhc3M9XCJwbS1iYXRjaC1kZWxldGUtaXRlbVwiIHZhbHVlPVwiJHtjb25maWcuaWR9XCIgc3R5bGU9XCJtYXJnaW4tcmlnaHQ6IDEwcHg7IHRyYW5zZm9ybTogc2NhbGUoMS4yKTtcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gdGl0bGU9XCIke3NhZmVOYW1lfVwiPiR7c2FmZU5hbWV9PC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgYDtcbiAgICB9KVxuICAgIC5qb2luKCcnKTtcblxuICBjb25zdCBwb3B1cEh0bWwgPSBgXG4gICAgICAgIDxkaXYgaWQ9XCIke3BvcHVwSWR9XCIgc3R5bGU9XCJwb3NpdGlvbjogZml4ZWQ7IHRvcDogMDsgbGVmdDogMDsgd2lkdGg6IDEwMCU7IGhlaWdodDogMTAwJTsgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLDAsMCwwLjUpOyB6LWluZGV4OiAxMDAwMTsgZGlzcGxheTogZmxleDsgYWxpZ24taXRlbXM6IGNlbnRlcjsganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XCI+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPVwiYmFja2dyb3VuZC1jb2xvcjogI2ZmZjhmMDsgY29sb3I6ICMzYTJjMmM7IGJvcmRlci1yYWRpdXM6IDE2cHg7IHBhZGRpbmc6IDIwcHg7IHdpZHRoOiA5MCU7IG1heC13aWR0aDogNDUwcHg7IGJveC1zaGFkb3c6IDAgNHB4IDI1cHggcmdiYSgxMjAsOTAsNjAsLjI1KTsgZGlzcGxheTogZmxleDsgZmxleC1kaXJlY3Rpb246IGNvbHVtbjsgbWF4LWhlaWdodDogODB2aDtcIj5cbiAgICAgICAgICAgICAgICA8aDQgc3R5bGU9XCJtYXJnaW4tdG9wOjA7IGNvbG9yOiNjNjI4Mjg7IHRleHQtYWxpZ246IGNlbnRlcjtcIj7pgInmi6nopoHmibnph4/liKDpmaTnmoTphY3nva48L2g0PlxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJtYXJnaW46IDEwcHggMDsgZGlzcGxheTogZmxleDsganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XCI+XG4gICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cImJhdGNoLWRlbGV0ZS1zZWxlY3QtYWxsXCIgc3R5bGU9XCJwYWRkaW5nOiA2cHggMTJweDsgYmFja2dyb3VuZC1jb2xvcjojYTVkNmY5OyBib3JkZXI6bm9uZTsgYm9yZGVyLXJhZGl1czo2cHg7IGN1cnNvcjpwb2ludGVyO1wiPuWFqOmAiTwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJiYXRjaC1kZWxldGUtZGVzZWxlY3QtYWxsXCIgc3R5bGU9XCJwYWRkaW5nOiA2cHggMTJweDsgYmFja2dyb3VuZC1jb2xvcjojZTBlMGUwOyBib3JkZXI6bm9uZTsgYm9yZGVyLXJhZGl1czo2cHg7IGN1cnNvcjpwb2ludGVyO1wiPuWFqOS4jemAiTwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJmbGV4OiAxOyBtaW4taGVpZ2h0OiAwOyBvdmVyZmxvdy15OiBhdXRvOyBtYXJnaW4tYm90dG9tOiAyMHB4OyBib3JkZXItdG9wOiAxcHggc29saWQgI2YwZTJkMDsgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNmMGUyZDA7IHBhZGRpbmc6IDVweCAxMHB4O1wiPlxuICAgICAgICAgICAgICAgICAgICAke2NvbmZpZ3NIdG1sfVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJ0ZXh0LWFsaWduOiByaWdodDsgZGlzcGxheTpmbGV4OyBqdXN0aWZ5LWNvbnRlbnQ6ZmxleC1lbmQ7IGdhcDogMTBweDtcIj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cImJhdGNoLWRlbGV0ZS1jYW5jZWxcIiBzdHlsZT1cInBhZGRpbmc6IDhweCAxNnB4OyBiYWNrZ3JvdW5kLWNvbG9yOiNlMGUwZTA7IGJvcmRlcjpub25lOyBib3JkZXItcmFkaXVzOjZweDsgY3Vyc29yOnBvaW50ZXI7IGNvbG9yOiMzMzM7XCI+5Y+W5raIPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJiYXRjaC1kZWxldGUtY29uZmlybVwiIHN0eWxlPVwicGFkZGluZzogOHB4IDE2cHg7IGJhY2tncm91bmQtY29sb3I6I2Y0NDMzNjsgYm9yZGVyOm5vbmU7IGJvcmRlci1yYWRpdXM6NnB4OyBjdXJzb3I6cG9pbnRlcjsgZm9udC13ZWlnaHQ6Ym9sZDsgY29sb3I6I2ZmZjtcIj7noa7orqTliKDpmaQ8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICBgO1xuXG4gICQoJ2JvZHknKS5hcHBlbmQocG9wdXBIdG1sKTtcbiAgY29uc3QgbW9iaWxlU3R5bGVzID0gYDxzdHlsZT5AbWVkaWEgKG1heC13aWR0aDogNjAwcHgpIHsgIyR7cG9wdXBJZH0geyBhbGlnbi1pdGVtczogZmxleC1zdGFydCAhaW1wb3J0YW50OyB9ICMke3BvcHVwSWR9ID4gZGl2IHsgbWFyZ2luLXRvcDogMjAwcHg7IH0gfTwvc3R5bGU+YDtcbiAgJChgIyR7cG9wdXBJZH1gKS5hcHBlbmQobW9iaWxlU3R5bGVzKTtcblxuICAkKCcjYmF0Y2gtZGVsZXRlLXNlbGVjdC1hbGwnKS5vbignY2xpY2snLCAoKSA9PiAkKCcucG0tYmF0Y2gtZGVsZXRlLWl0ZW0nKS5wcm9wKCdjaGVja2VkJywgdHJ1ZSkpO1xuICAkKCcjYmF0Y2gtZGVsZXRlLWRlc2VsZWN0LWFsbCcpLm9uKCdjbGljaycsICgpID0+ICQoJy5wbS1iYXRjaC1kZWxldGUtaXRlbScpLnByb3AoJ2NoZWNrZWQnLCBmYWxzZSkpO1xuICAkKCcjYmF0Y2gtZGVsZXRlLWNhbmNlbCcpLm9uKCdjbGljaycsICgpID0+ICQoYCMke3BvcHVwSWR9YCkucmVtb3ZlKCkpO1xuICAkKCcjYmF0Y2gtZGVsZXRlLWNvbmZpcm0nKS5vbignY2xpY2snLCAoKSA9PiB7XG4gICAgY29uc3Qgc2VsZWN0ZWRJZHM6IHN0cmluZ1tdID0gW107XG4gICAgJCgnLnBtLWJhdGNoLWRlbGV0ZS1pdGVtOmNoZWNrZWQnKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGVjdGVkSWRzLnB1c2goJCh0aGlzKS52YWwoKSBhcyBzdHJpbmcpO1xuICAgIH0pO1xuICAgIGJhdGNoRGVsZXRlQ29uZmlncyhzZWxlY3RlZElkcyk7XG4gICAgJChgIyR7cG9wdXBJZH1gKS5yZW1vdmUoKTtcbiAgfSk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGJhdGNoRGVsZXRlQ29uZmlncyhjb25maWdJZHM6IHN0cmluZ1tdKTogUHJvbWlzZTx2b2lkPiB7XG4gIGlmIChjb25maWdJZHMubGVuZ3RoID09PSAwKSB7XG4gICAgdG9hc3RyLmluZm8oJ+acqumAieaLqeS7u+S9leimgeWIoOmZpOeahOmFjee9ruOAgicpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IGNvbmZpcm0gPSBhd2FpdCB0cmlnZ2VyU2xhc2goXG4gICAgYC9wb3B1cCBva0J1dHRvbj1cIuehruiupOWIoOmZpFwiIGNhbmNlbEJ1dHRvbj1cIuWPlua2iFwiIHJlc3VsdD10cnVlIFwi6K2m5ZGK77ya5oKo56Gu5a6a6KaB5Yig6Zmk6YCJ5Lit55qEICR7Y29uZmlnSWRzLmxlbmd0aH0g5Liq6YWN572u5ZCX77yf5q2k5pON5L2c5peg5rOV5pKk6ZSA44CCXCJgLFxuICApO1xuICBpZiAoY29uZmlybSAhPT0gJzEnKSB7XG4gICAgdG9hc3RyLmluZm8oJ+aJuemHj+WIoOmZpOaTjeS9nOW3suWPlua2iOOAgicpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHRyeSB7XG4gICAgY29uc3Qgc3RvcmVkQ29uZmlncyA9IGF3YWl0IGdldFN0b3JlZENvbmZpZ3MoKTtcbiAgICBjb25zdCBpZHNUb0RlbGV0ZSA9IG5ldyBTZXQoY29uZmlnSWRzKTtcbiAgICBPYmplY3Qua2V5cyhzdG9yZWRDb25maWdzKS5mb3JFYWNoKGlkID0+IHtcbiAgICAgIGlmIChpZHNUb0RlbGV0ZS5oYXMoaWQpKSBkZWxldGUgc3RvcmVkQ29uZmlnc1tpZF07XG4gICAgfSk7XG4gICAgYXdhaXQgc2V0U3RvcmVkQ29uZmlncyhzdG9yZWRDb25maWdzKTtcbiAgICB0b2FzdHIuc3VjY2Vzcyhg5bey5oiQ5Yqf5Yig6ZmkICR7Y29uZmlnSWRzLmxlbmd0aH0g5Liq6YWN572u44CCYCk7XG4gICAgYXdhaXQgcmVuZGVyQ29uZmlnc0xpc3QoKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCfmibnph4/liKDpmaTlpLHotKU6JywgZXJyb3IpO1xuICAgIHRvYXN0ci5lcnJvcign5om56YeP5Yig6Zmk5aSx6LSl77yM6K+35qOA5p+l5o6n5Yi25Y+w44CCJyk7XG4gIH1cbn1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/喵喵预设配置管理/批量操作功能.ts\n\n}");

/***/ }),

/***/ 320:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BR: () => (/* binding */ setStoredConfigs),
/* harmony export */   getStoredConfigs: () => (/* binding */ getStoredConfigs),
/* harmony export */   ih: () => (/* binding */ clearConfigCache),
/* harmony export */   sd: () => (/* binding */ renderConfigsList)
/* harmony export */ });
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(291);

// 添加配置缓存
let configCache = null;
let lastCacheTime = 0;
const CONFIG_CACHE_DURATION = 10000; // 10秒缓存
async function getStoredConfigs() {
    // 检查缓存是否有效
    const now = Date.now();
    if (configCache && now - lastCacheTime < CONFIG_CACHE_DURATION) {
        return configCache;
    }
    let worldbookEntries;
    try {
        worldbookEntries = await TavernHelper.getWorldbook(___WEBPACK_IMPORTED_MODULE_0__/* .CONFIG_LOREBOOK_NAME */ .Db);
    }
    catch (error) {
        return {};
    }
    const v2Entry = worldbookEntries.find((entry) => entry.strategy?.keys?.includes(___WEBPACK_IMPORTED_MODULE_0__/* .V2_MIGRATION_KEY */ .KL));
    if (v2Entry) {
        console.log('喵喵预设配置管理: 检测到旧版合并数据，正在迁移...');
        try {
            const configsArray = JSON.parse(v2Entry.content);
            const migratedEntries = configsArray.map((config) => ({
                name: config.name || config.id,
                strategy: { type: 'constant', keys: [config.id] },
                content: JSON.stringify(config),
                enabled: false,
            }));
            const otherEntries = worldbookEntries.filter((entry) => !entry.strategy?.keys?.includes(___WEBPACK_IMPORTED_MODULE_0__/* .V2_MIGRATION_KEY */ .KL));
            await TavernHelper.createOrReplaceWorldbook(___WEBPACK_IMPORTED_MODULE_0__/* .CONFIG_LOREBOOK_NAME */ .Db, [...otherEntries, ...migratedEntries]);
            toastr.info('喵喵预设配置管理：已自动升级数据格式。');
            worldbookEntries = await TavernHelper.getWorldbook(___WEBPACK_IMPORTED_MODULE_0__/* .CONFIG_LOREBOOK_NAME */ .Db);
        }
        catch (e) {
            console.error('迁移配置失败:', e);
            toastr.error('自动迁移配置数据失败，请检查控制台。');
        }
    }
    const configs = {};
    for (const entry of worldbookEntries) {
        try {
            const configData = JSON.parse(entry.content);
            if (configData.id && configData.name && Array.isArray(configData.states)) {
                configs[configData.id] = configData;
            }
        }
        catch (e) {
            // 忽略解析失败的条目
        }
    }
    // 更新缓存
    configCache = configs;
    lastCacheTime = now;
    return configs;
}
// 清除配置缓存
function clearConfigCache() {
    configCache = null;
    lastCacheTime = 0;
}
async function setStoredConfigs(configsObject) {
    try {
        const nameCounts = {};
        const entries = Object.values(configsObject).map(config => {
            let entryName = config.name;
            nameCounts[entryName] = (nameCounts[entryName] || 0) + 1;
            if (nameCounts[entryName] > 1) {
                entryName = `${entryName} (${config.id.slice(-5)})`;
            }
            return {
                name: entryName,
                strategy: { type: 'constant', keys: [config.id] },
                content: JSON.stringify(config),
                enabled: false,
                comment: `MiaoMiao Preset Config: ${config.name} (ID: ${config.id})`,
            };
        });
        await TavernHelper.createOrReplaceWorldbook(___WEBPACK_IMPORTED_MODULE_0__/* .CONFIG_LOREBOOK_NAME */ .Db, entries);
    }
    catch (error) {
        console.error('写入配置到世界书失败:', error);
        toastr.error('配置保存/更新失败，请检查控制台日志。');
    }
}
async function renderConfigsList() {
    const configsObject = await getStoredConfigs();
    const configs = Object.values(configsObject);
    const listElement = $('#preset-manager-list');
    listElement.empty();
    if (configs.length === 0) {
        listElement.append('<li style="color:#888; padding:10px;">暂无已保存的配置。</li>');
        return;
    }
    const groupedConfigs = configs.reduce((acc, config) => {
        const groupName = config.presetName || '未分类';
        if (!acc[groupName])
            acc[groupName] = [];
        acc[groupName].push(config);
        return acc;
    }, {});
    const sortedGroupNames = Object.keys(groupedConfigs).sort((a, b) => {
        if (a === '未分类')
            return 1;
        if (b === '未分类')
            return -1;
        return a.localeCompare(b);
    });
    for (const groupName of sortedGroupNames) {
        const configsInGroup = groupedConfigs[groupName];
        const safeGroupName = $('<div/>').text(groupName).html();
        const isUncategorized = groupName === '未分类';
        const groupElement = $(`
            <details class="pm-config-group" ${isUncategorized ? 'open' : ''}>
                <summary class="pm-config-group-summary">${safeGroupName} <span class="pm-config-count">(${configsInGroup.length})</span></summary>
                <ul class="pm-config-sublist"></ul>
            </details>
        `);
        const sublist = groupElement.find('.pm-config-sublist');
        for (const configData of configsInGroup) {
            const boundCharDisplay = configData.boundCharName
                ? `<span style="color:#4CAF50; margin-left: 8px; font-weight:bold;">(绑定: ${configData.boundCharName})</span>`
                : '';
            const listItem = $(`
                <li style="display:flex; justify-content:space-between; align-items:center; padding:10px; border-bottom: 1px solid #f0e2d0; font-size:14px;">
                    <div style="display:flex; flex-direction:column; align-items:flex-start; overflow:hidden; margin-right: 10px; flex: 1; min-width: 0;">
                        <span style="font-weight:bold; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width: 100%;" title="${$('<div/>').text(configData.name).html()}">${$('<div/>').text(configData.name).html()}${boundCharDisplay}</span>
                    </div>
                    <div class="pm-actions-container">
                        <button data-id="${configData.id}" name="load-config" style="background-color:#f9d6a5; color:#3a2c2c;">加载</button>
                        <button data-id="${configData.id}" name="delete-config" style="background-color:#f5a8a0; color:#fff;">删除</button>
                        <div class="pm-more-btn-wrapper">
                            <button name="more-actions" style="background-color:#b0bec5; color:#fff;">更多</button>
                            <div class="pm-submenu">
                                <button data-id="${configData.id}" name="view-config">查看</button>
                                <button data-id="${configData.id}" name="update-config">更新</button>
                                <button data-id="${configData.id}" name="rename-config">重命名</button>
                                <button data-id="${configData.id}" name="bind-regex">正则</button>
                                <button data-id="${configData.id}" name="export-config">导出</button>
                                <div style="border-top: 1px solid #eee; margin: 5px 0;"></div>
                                <button name="close-submenu" style="color: #888; text-align: center;">关闭</button>
                            </div>
                        </div>
                    </div>
                </li>
            `);
            sublist.append(listItem);
        }
        listElement.append(groupElement);
    }
    // 绑定按钮事件
    // 使用动态导入避免循环引用
    Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 516)).then(({ bindConfigListEvents }) => {
        bindConfigListEvents();
    });
}


/***/ }),

/***/ 510:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  exportConfig: () => (/* binding */ exportConfig),
  k: () => (/* binding */ handleFileImport)
});

;// external "https://testingcf.jsdelivr.net/npm/downloadjs/+esm"

// EXTERNAL MODULE: ./src/喵喵预设配置管理/初始化和配置.ts
var _ = __webpack_require__(291);
// EXTERNAL MODULE: ./src/喵喵预设配置管理/条目分组功能.ts
var src_ = __webpack_require__(11);
// EXTERNAL MODULE: ./src/喵喵预设配置管理/正则绑定功能.ts
var src_0 = __webpack_require__(65);
// EXTERNAL MODULE: ./src/喵喵预设配置管理/配置存储和读取.ts
var src_1 = __webpack_require__(320);
;// ./src/喵喵预设配置管理/导入导出功能.ts





async function exportConfig(configId) {
    try {
        const configs = await (0,src_1.getStoredConfigs)();
        const configData = configs[configId];
        if (!configData) {
            toastr.error(`配置不存在，无法导出。`);
            return;
        }
        const configName = configData.name;
        let userRemark = '';
        const addRemarkChoice = await triggerSlash(`/popup okButton="是" cancelButton="否" result=true "是否要为此导出添加备注信息？"`);
        if (addRemarkChoice === '1') {
            userRemark = await triggerSlash(`/input multiline=true placeholder="请输入备注，例如预设用途、来源等..." "添加备注"`);
        }
        const exportBundle = {
            type: 'MiaoMiaoPresetBundle',
            version: 1,
            remark: userRemark || '',
            presetConfig: configData,
            presetData: null,
            regexData: null,
            groupingConfig: null,
        };
        const configPresetName = configData.presetName;
        if (configPresetName && TavernHelper.getPresetNames().includes(configPresetName)) {
            const includePresetChoice = await triggerSlash(`/popup okButton="是" cancelButton="否" result=true "此配置关联了预设 \\"${configPresetName}\\"。是否要将预设文件本身一起打包导出？"`);
            if (includePresetChoice === '1') {
                const presetData = TavernHelper.getPreset(configPresetName);
                if (presetData) {
                    presetData.name = configPresetName;
                    exportBundle.presetData = presetData;
                    toastr.info(`已将预设 "${configPresetName}" 打包。`);
                }
                else {
                    toastr.warning(`无法获取预设 "${configPresetName}" 的数据。`);
                }
            }
        }
        if (configData.regexStates && configData.regexStates.length > 0) {
            const userChoice = await triggerSlash(`/popup okButton="是" cancelButton="否" result=true "此配置绑定了正则。是否选择要一起导出的正则？"`);
            if (userChoice === '1') {
                const boundRegexIds = new Set(configData.regexStates.map(r => r.id));
                const allGlobalRegexes = await TavernHelper.getTavernRegexes({ scope: 'global' });
                const boundRegexes = allGlobalRegexes.filter((r) => boundRegexIds.has(r.id));
                const { showRegexExportSelectionPopup } = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 780));
                const selectedRegexes = await showRegexExportSelectionPopup(boundRegexes);
                if (selectedRegexes) {
                    exportBundle.regexData = selectedRegexes;
                    toastr.info(`已将 ${selectedRegexes.length} 条正则打包导出。`);
                }
                else {
                    toastr.info('已取消导出正则。');
                }
            }
        }
        // 检查是否包含分组配置
        const groupingPresetName = configData.presetName;
        if (groupingPresetName) {
            const groupingConfig = (0,src_/* exportPresetGrouping */.pM)(groupingPresetName);
            if (groupingConfig) {
                const includeGroupingChoice = await triggerSlash(`/popup okButton="是" cancelButton="否" result=true "预设 \\"${groupingPresetName}\\" 包含条目分组设置。是否要一起导出？"`);
                if (includeGroupingChoice === '1') {
                    exportBundle.groupingConfig = groupingConfig;
                    toastr.info('已将分组设置打包导出。');
                }
            }
        }
        const defaultFileName = `${configName}_bundle`;
        let userFileName = await triggerSlash(`/input default="${defaultFileName}" "请输入导出的文件名（无需后缀）"`);
        if (!userFileName || userFileName.trim() === '') {
            userFileName = defaultFileName;
            toastr.info('文件名为空，已使用默认名称。');
        }
        userFileName = userFileName.trim().replace(/\.json$/, '');
        const jsonString = JSON.stringify(exportBundle, null, 2);
        default_0(jsonString, `${userFileName}.json`, 'text/plain');
        toastr.success(`配置包 "${configName}" 已导出。`);
    }
    catch (error) {
        console.error('导出配置失败:', error);
        toastr.error('导出配置失败，请检查控制台获取更多信息。');
    }
}
async function handleFileImport(event) {
    const file = event.target.files[0];
    if (!file)
        return;
    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            const content = e.target?.result;
            const parsedContent = JSON.parse(content);
            if (parsedContent.entries && typeof parsedContent.entries === 'object') {
                toastr.info('检测到世界书备份文件。');
                const configsToImport = [];
                for (const entry of Object.values(parsedContent.entries)) {
                    if (entry.content) {
                        try {
                            const config = JSON.parse(entry.content);
                            if (config.id && config.name && Array.isArray(config.states)) {
                                configsToImport.push(config);
                            }
                        }
                        catch (err) {
                            // 忽略解析失败的条目
                        }
                    }
                }
                if (configsToImport.length > 0) {
                    const { startBatchImportFlow } = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 723));
                    await startBatchImportFlow(configsToImport);
                }
                else {
                    toastr.warning('世界书文件中未找到有效的喵喵配置数据。');
                }
                return;
            }
            if (parsedContent.remark) {
                const { showRemarkPopup } = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 780));
                await showRemarkPopup(parsedContent.remark);
            }
            if (parsedContent.type === 'MiaoMiaoPresetMegaBundle') {
                const { handleMegaBundleImport } = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 723));
                await handleMegaBundleImport(parsedContent);
                return;
            }
            let configToImport, presetToImport, regexToImport, groupingToImport;
            if (parsedContent.type === 'MiaoMiaoPresetBundle') {
                console.log('检测到整合包文件，版本:', parsedContent.version);
                toastr.info('检测到整合包文件。');
                configToImport = parsedContent.presetConfig;
                presetToImport = parsedContent.presetData;
                regexToImport = parsedContent.regexData;
                groupingToImport = parsedContent.groupingConfig;
                console.log('分组配置:', groupingToImport);
            }
            else {
                configToImport = parsedContent;
            }
            if (!configToImport || typeof configToImport.presetName !== 'string' || !Array.isArray(configToImport.states)) {
                toastr.error('导入失败：配置数据格式不正确。');
                return;
            }
            if (presetToImport) {
                const importPresetChoice = await triggerSlash(`/popup okButton="是" cancelButton="否" result=true "此文件包含预设文件 \\"${presetToImport.name}\\"。是否导入/覆盖？"`);
                if (importPresetChoice === '1') {
                    await TavernHelper.createOrReplacePreset(presetToImport.name, presetToImport);
                    toastr.success(`预设文件 "${presetToImport.name}" 已导入。`);
                }
            }
            if (regexToImport && regexToImport.length > 0) {
                await (0,src_0/* importRegexLogic */.P)(regexToImport);
            }
            // 处理分组配置导入
            if (groupingToImport && Array.isArray(groupingToImport) && groupingToImport.length > 0) {
                if (configToImport.presetName) {
                    try {
                        console.log('导入分组配置:', groupingToImport);
                        (0,src_/* importPresetGrouping */.q$)(configToImport.presetName, groupingToImport);
                        toastr.success('已成功导入并应用分组设置到预设。');
                    }
                    catch (error) {
                        console.error('导入分组配置失败:', error);
                        toastr.error('导入分组配置失败：' + error.message);
                    }
                }
                else {
                    console.warn('配置中没有预设名称，无法导入分组配置');
                }
            }
            const initialName = configToImport.name || file.name.replace(/_bundle\.json$/i, '').replace(/\.json$/i, '');
            let configName = await triggerSlash(`/input default="${initialName}" "请输入导入配置的名称"`);
            configName = configName.trim();
            if (!configName) {
                toastr.info('导入已取消。');
                return;
            }
            const configs = await (0,src_1.getStoredConfigs)();
            configToImport.name = configName;
            configToImport.id = (0,_/* generateUniqueId */.Ij)(); // Always generate new ID for single import
            configs[configToImport.id] = configToImport;
            await (0,src_1/* setStoredConfigs */.BR)(configs);
            toastr.success(`配置 "${configName}" 已成功导入。`);
            await (0,src_1/* renderConfigsList */.sd)();
        }
        catch (error) {
            console.error('导入文件失败:', error);
            toastr.error('导入文件失败，请检查控制台获取更多信息。');
        }
        finally {
            $(event.target).val('');
        }
    };
    reader.readAsText(file);
}


/***/ }),

/***/ 516:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bindConfigListEvents: () => (/* binding */ bindConfigListEvents)
/* harmony export */ });
// 配置列表的按钮事件绑定
function bindConfigListEvents() {
    const listElement = $('#preset-manager-list');
    listElement.off('click', 'button').on('click', 'button', async function (e) {
        const button = $(this);
        const action = button.attr('name');
        if (action === 'more-actions') {
            e.stopPropagation();
            const submenu = button.siblings('.pm-submenu');
            $('.pm-submenu').not(submenu).hide(); // Hide other open menus
            submenu.toggle();
            return;
        }
        if (action === 'close-submenu') {
            button.closest('.pm-submenu').hide();
            return;
        }
        const configId = button.data('id');
        // 动态导入避免循环引用
        switch (action) {
            case 'rename-config': {
                const { renameConfig } = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 884));
                await renameConfig(configId);
                break;
            }
            case 'update-config': {
                const { updateConfig } = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 884));
                await updateConfig(configId);
                break;
            }
            case 'load-config': {
                const { loadConfig } = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 884));
                await loadConfig(configId);
                break;
            }
            case 'export-config': {
                const { exportConfig } = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 510));
                await exportConfig(configId);
                break;
            }
            case 'delete-config': {
                const { deleteConfig } = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 884));
                await deleteConfig(configId);
                break;
            }
            case 'bind-regex': {
                const { showRegexBindingPopup } = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 65));
                await showRegexBindingPopup(configId);
                break;
            }
            case 'view-config': {
                const { showViewConfigPopup } = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 780));
                await showViewConfigPopup(configId);
                break;
            }
        }
        button.closest('.pm-submenu').hide();
    });
}


/***/ }),

/***/ 574:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RD: () => (/* binding */ createUI),
/* harmony export */   jS: () => (/* binding */ toggleUI),
/* harmony export */   oz: () => (/* binding */ updateConfigListCache)
/* harmony export */ });
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(291);
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(510);
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(723);
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(11);
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(780);
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(320);
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(884);







function createUI() {
    if ($(`#${___WEBPACK_IMPORTED_MODULE_0__/* .UI_ID */ .Xl}`).length > 0)
        return;
    const uiContainer = $(`
        <div id="${___WEBPACK_IMPORTED_MODULE_0__/* .UI_ID */ .Xl}">
            <style>
                #${___WEBPACK_IMPORTED_MODULE_0__/* .UI_ID */ .Xl}{display:none;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:10000;background-color:#fff8f0;color:#3a2c2c;border:1px solid #e0c9a6;border-radius:16px;padding:20px;box-shadow:0 4px 25px rgba(120,90,60,.25);width:90%;max-width:550px;max-height:80vh;font-family:'Segoe UI',sans-serif;display:flex;flex-direction:column}#${___WEBPACK_IMPORTED_MODULE_0__/* .UI_ID */ .Xl} h4{margin-top:0;border-bottom:2px solid #f0d8b6;padding-bottom:10px;color:#6a4226}#${___WEBPACK_IMPORTED_MODULE_0__/* .UI_ID */ .Xl} h5{margin:8px 0;color:#7a5235}#${___WEBPACK_IMPORTED_MODULE_0__/* .UI_ID */ .Xl} button{transition:all .2s ease}#${___WEBPACK_IMPORTED_MODULE_0__/* .UI_ID */ .Xl} button:hover{opacity:.85}#${___WEBPACK_IMPORTED_MODULE_0__/* .UI_ID */ .Xl} #preset-manager-list-section{flex:1;overflow-y:auto}@media (max-width:600px){#${___WEBPACK_IMPORTED_MODULE_0__/* .UI_ID */ .Xl}{top:0;left:0;transform:none;width:100%;height:100vh;max-width:none;max-height:none;border-radius:0;padding:10px;box-shadow:none;display:flex;flex-direction:column}#${___WEBPACK_IMPORTED_MODULE_0__/* .UI_ID */ .Xl} h4{font-size:18px;text-align:center;padding:12px 0;margin:0;border-bottom:2px solid #f0d8b6}#${___WEBPACK_IMPORTED_MODULE_0__/* .UI_ID */ .Xl} #preset-manager-close{top:10px;right:10px;font-size:28px}#${___WEBPACK_IMPORTED_MODULE_0__/* .UI_ID */ .Xl} #preset-manager-save-section{flex-wrap:wrap}#${___WEBPACK_IMPORTED_MODULE_0__/* .UI_ID */ .Xl} #preset-manager-name-input{width:100%;margin-left:0;margin-bottom:10px}}
                .pm-switch{position:relative;display:inline-block;width:40px;height:20px;flex-shrink:0}.pm-switch input{opacity:0;width:0;height:0}.pm-slider{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background-color:#ccc;transition:.4s;border-radius:20px}.pm-slider:before{position:absolute;content:"";height:16px;width:16px;left:2px;bottom:2px;background-color:#fff;transition:.4s;border-radius:50%}input:checked+.pm-slider{background-color:#4CAF50}input:checked+.pm-slider:before{transform:translateX(20px)}
                #preset-manager-tips-section { margin-top: 15px; padding: 10px; background-color: #f9f3ea; border-radius: 8px; font-size: 12px; color: #7a5235; text-align: center; flex-shrink: 0; }
                .pm-config-group summary { cursor: pointer; padding: 8px; background-color: #f7f0e4; border-radius: 6px; margin-top: 5px; font-weight: bold; } .pm-config-group summary:hover { background-color: #f0e2d0; } .pm-config-count { color: #888; font-weight: normal; margin-left: 5px; } .pm-config-sublist { list-style: none; padding-left: 15px; border-left: 2px solid #f0e2d0; margin-left: 8px; }
                .pm-actions-container { display: flex; align-items: center; gap: 5px; justify-content: flex-end; }
                .pm-actions-container > button, .pm-more-btn-wrapper > button { flex-shrink: 0; padding: 6px 12px; font-size: 13px; font-weight: 500; border-radius: 6px; cursor: pointer; border: none; }
                .pm-more-btn-wrapper { position: relative; }
                .pm-submenu { display: none; position: absolute; right: 0; top: calc(100% + 5px); background-color: #fff; border: 1px solid #e0c9a6; border-radius: 8px; box-shadow: 0 3px 15px rgba(120,90,60,.15); z-index: 10003; padding: 5px; min-width: 100px; }
                .pm-submenu button { display: block; width: 100%; text-align: left; padding: 8px 12px; border: none; background: none; font-size: 13px; border-radius: 4px; color: #3a2c2c; cursor: pointer; }
                .pm-submenu button:hover { background-color: #f0e2d0; }
            </style>

            <h4>喵喵预设配置管理by小n</h4>
            <button id="preset-manager-close" style="position:absolute; top:12px; right:16px; background:none; border:none; color:#9a6b4f; font-size:24px; cursor:pointer;">&times;</button>
            
            <div id="preset-manager-save-section" style="margin-bottom: 20px; margin-top:15px;">
                <div style="display:flex; flex-wrap: wrap; align-items:center;">
                    <label for="preset-manager-name-input" style="font-weight:bold; flex-shrink:0;">配置名称:</label>
                    <input type="text" id="preset-manager-name-input" placeholder="例如：仅破限" style="flex:1; min-width: 100px; margin-left: 10px; background-color: #fff; border: 1px solid #d4b58b; color:#3a2c2c; padding: 6px 8px; border-radius: 6px; font-size:14px;" />
                    <button id="preset-manager-save-btn" style="margin-left: 10px; padding:6px 12px; background-color:#f4c78e; border:none; border-radius:6px; color:#3a2c2c; cursor:pointer; font-weight:bold;">保存</button>
                </div>
                <div style="margin-top: 10px; display:flex; align-items:center; padding-left: 5px;">
                   <label for="preset-manager-bind-char" style="cursor:pointer;">绑定到当前角色</label>
                   <label class="pm-switch" style="margin-left: auto;">
                      <input type="checkbox" id="preset-manager-bind-char"/>
                      <span class="pm-slider"></span>
                   </label>
                </div>
                <!-- 分割线 -->
                <hr style="margin: 15px 0; border: none; border-top: 1px solid #e0c9a6; opacity: 0.6;">
                <div style="display:flex; flex-wrap: wrap; gap: 10px; align-items:center;">
                    <button id="preset-manager-help-btn" style="padding:6px 12px; background-color:#bcaaa4; border:none; border-radius:6px; color:#3a2c2c; cursor:pointer; font-weight:bold;">使用说明</button>
                    <button id="preset-manager-import-btn" style="padding:6px 12px; background-color:#a5d6f9; border:none; border-radius:6px; color:#3a2c2c; cursor:pointer; font-weight:bold;">导入</button>
                    <button id="preset-manager-batch-export-btn" style="padding:6px 12px; background-color:#81c784; border:none; border-radius:6px; color:#3a2c2c; cursor:pointer; font-weight:bold;">批量导出</button>
                    <button id="preset-manager-batch-delete-btn" style="padding:6px 12px; background-color:#ef9a9a; border:none; border-radius:6px; color:#fff; cursor:pointer; font-weight:bold;">批量删除</button>
                    <button id="preset-manager-grouping-btn" style="padding:6px 12px; background-color:#9c27b0; border:none; border-radius:6px; color:#fff; cursor:pointer; font-weight:bold;">条目分组</button>
                </div>
            </div>

            <div id="preset-manager-list-section">
                <h5>已保存的配置:</h5>
                <ul id="preset-manager-list" style="list-style:none; padding:0; margin:0;"></ul>
            </div>

            <div id="preset-manager-tips-section"></div>
        </div>
    `);
    $('body').append(uiContainer);
    $('body').append('<input type="file" id="preset-manager-import-file" accept=".json" style="display:none;">');
    $(`#${___WEBPACK_IMPORTED_MODULE_0__/* .UI_ID */ .Xl}`).hide();
    // 绑定事件处理器
    bindUIEvents();
}
function bindUIEvents() {
    console.log('🔗 开始绑定UI事件...');
    $('#preset-manager-close').on('click', () => {
        console.log('🖱️ 关闭按钮被点击');
        toggleUI();
    });
    $('#preset-manager-help-btn').on('click', () => {
        console.log('🖱️ 帮助按钮被点击');
        (0,___WEBPACK_IMPORTED_MODULE_4__/* .showHelpPopup */ .V9)();
    });
    $('#preset-manager-save-btn').on('click', () => {
        console.log('🖱️ 保存按钮被点击');
        (0,___WEBPACK_IMPORTED_MODULE_6__/* .saveCurrentConfig */ .Z)();
    });
    $('#preset-manager-import-btn').on('click', () => {
        console.log('🖱️ 导入按钮被点击');
        $('#preset-manager-import-file').click();
    });
    $('#preset-manager-batch-export-btn').on('click', () => {
        console.log('🖱️ 批量导出按钮被点击');
        (0,___WEBPACK_IMPORTED_MODULE_2__/* .showBatchExportPopup */ .c)();
    });
    $('#preset-manager-batch-delete-btn').on('click', () => {
        console.log('🖱️ 批量删除按钮被点击');
        (0,___WEBPACK_IMPORTED_MODULE_2__/* .showBatchDeletePopup */ .x)();
    });
    $('#preset-manager-grouping-btn').on('click', () => {
        console.log('🖱️ 条目分组按钮被点击');
        (0,___WEBPACK_IMPORTED_MODULE_3__/* .showPromptGroupingUI */ .XZ)();
    });
    $('#preset-manager-import-file').on('change', event => {
        console.log('🖱️ 文件选择发生变化');
        (0,___WEBPACK_IMPORTED_MODULE_1__/* .handleFileImport */ .k)(event);
    });
    console.log('✅ UI事件绑定完成');
}
// 缓存配置列表，避免重复渲染
let configListCache = null;
let lastConfigUpdateTime = 0;
const CACHE_DURATION = 5000; // 5秒缓存
function toggleUI() {
    const ui = $(`#${___WEBPACK_IMPORTED_MODULE_0__/* .UI_ID */ .Xl}`);
    if (ui.is(':visible')) {
        ui.fadeOut(200); // 减少动画时间
    }
    else {
        // 检查缓存是否有效
        const now = Date.now();
        if (!configListCache || now - lastConfigUpdateTime > CACHE_DURATION) {
            (0,___WEBPACK_IMPORTED_MODULE_5__/* .renderConfigsList */ .sd)();
            lastConfigUpdateTime = now;
        }
        else {
            // 使用缓存的配置列表
            $('#preset-manager-list').html(configListCache);
        }
        const randomTip = ___WEBPACK_IMPORTED_MODULE_0__/* .TIPS */ .df[Math.floor(Math.random() * ___WEBPACK_IMPORTED_MODULE_0__/* .TIPS */ .df.length)];
        $('#preset-manager-tips-section').text('小贴士：' + randomTip);
        ui.fadeIn(200); // 减少动画时间
    }
}
// 更新缓存
function updateConfigListCache() {
    configListCache = $('#preset-manager-list').html();
    lastConfigUpdateTime = Date.now();
}


/***/ }),

/***/ 723:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   c: () => (/* binding */ showBatchExportPopup),
/* harmony export */   handleMegaBundleImport: () => (/* binding */ handleMegaBundleImport),
/* harmony export */   startBatchImportFlow: () => (/* binding */ startBatchImportFlow),
/* harmony export */   x: () => (/* binding */ showBatchDeletePopup)
/* harmony export */ });
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(291);
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(65);
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(780);
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(320);




async function showBatchExportPopup() {
    const popupId = 'preset-manager-batch-export-popup';
    $(`#${popupId}`).remove();
    const configs = Object.values(await (0,___WEBPACK_IMPORTED_MODULE_3__.getStoredConfigs)());
    if (configs.length === 0) {
        toastr.info('没有可导出的配置。');
        return;
    }
    const configsHtml = configs
        .map(config => {
        const safeName = $('<div/>').text(config.name).html();
        return `
            <div style="padding: 8px 5px; border-bottom: 1px solid #eee; display: flex; align-items: center;">
                <label style="cursor:pointer; display:flex; align-items:center; width: 100%;">
                    <input type="checkbox" class="pm-batch-export-item" value="${config.id}" style="margin-right: 10px; transform: scale(1.2);">
                    <span>${safeName}</span>
                </label>
            </div>
        `;
    })
        .join('');
    const popupHtml = `
        <div id="${popupId}" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: 10001; display: flex; align-items: center; justify-content: center;">
            <div style="background-color: #fff8f0; color: #3a2c2c; border-radius: 16px; padding: 20px; width: 90%; max-width: 450px; box-shadow: 0 4px 25px rgba(120,90,60,.25); display: flex; flex-direction: column; max-height: 80vh;">
                <h4 style="margin-top:0; color:#6a4226; text-align: center;">选择要批量导出的配置</h4>
                <div style="margin: 10px 0; display: flex; justify-content: space-around;">
                   <button id="batch-export-select-all" style="padding: 6px 12px; background-color:#a5d6f9; border:none; border-radius:6px; cursor:pointer;">全选</button>
                   <button id="batch-export-deselect-all" style="padding: 6px 12px; background-color:#e0e0e0; border:none; border-radius:6px; cursor:pointer;">全不选</button>
                </div>
                <div style="flex: 1; min-height: 0; overflow-y: auto; margin-bottom: 20px; border-top: 1px solid #f0e2d0; border-bottom: 1px solid #f0e2d0; padding: 5px 10px;">
                    ${configsHtml}
                </div>
                <div style="text-align: right; display:flex; justify-content:flex-end; gap: 10px;">
                    <button id="batch-export-cancel" style="padding: 8px 16px; background-color:#e0e0e0; border:none; border-radius:6px; cursor:pointer; color:#333;">取消</button>
                    <button id="batch-export-confirm" style="padding: 8px 16px; background-color:#f4c78e; border:none; border-radius:6px; cursor:pointer; font-weight:bold; color:#3a2c2c;">确认导出</button>
                </div>
            </div>
        </div>
    `;
    $('body').append(popupHtml);
    const mobileStyles = `<style>
        @media (max-width: 600px) { #${popupId} > div { margin-top: 5vh; } }
    </style>`;
    $(`#${popupId}`).append(mobileStyles);
    $('#batch-export-select-all').on('click', () => $('.pm-batch-export-item').prop('checked', true));
    $('#batch-export-deselect-all').on('click', () => $('.pm-batch-export-item').prop('checked', false));
    $('#batch-export-cancel').on('click', () => $(`#${popupId}`).remove());
    $('#batch-export-confirm').on('click', async () => {
        const selectedIds = new Set();
        $('.pm-batch-export-item:checked').each(function () {
            selectedIds.add($(this).val());
        });
        const allConfigs = await (0,___WEBPACK_IMPORTED_MODULE_3__.getStoredConfigs)();
        const selectedConfigs = Object.values(allConfigs).filter(c => selectedIds.has(c.id));
        batchExportConfigs(selectedConfigs);
        $(`#${popupId}`).remove();
    });
}
async function batchExportConfigs(selectedConfigs) {
    if (selectedConfigs.length === 0) {
        toastr.info('未选择任何配置。');
        return;
    }
    try {
        let userRemark = '';
        const addRemarkChoice = await triggerSlash(`/popup okButton="是" cancelButton="否" result=true "是否要为这个批量导出的整合包添加备注信息？"`);
        if (addRemarkChoice === '1') {
            userRemark = await triggerSlash(`/input multiline=true placeholder="请输入备注，例如这批配置的共同特点..." "为整合包添加备注"`);
        }
        const megaBundle = {
            type: 'MiaoMiaoPresetMegaBundle',
            version: 1,
            remark: userRemark || '',
            presetConfigs: {},
            presets: {},
            regexData: [],
        };
        const uniquePresetNames = new Set();
        for (const configData of selectedConfigs) {
            megaBundle.presetConfigs[configData.id] = configData;
            if (configData.presetName) {
                uniquePresetNames.add(configData.presetName);
            }
        }
        if (uniquePresetNames.size > 0) {
            const presetList = Array.from(uniquePresetNames).join(', ');
            const includePresetsChoice = await triggerSlash(`/popup okButton="是" cancelButton="否" result=true "您选择的配置关联了以下预设：${presetList}。是否要将这些预设文件一同打包导出？"`);
            if (includePresetsChoice === '1') {
                let includedCount = 0;
                for (const presetName of uniquePresetNames) {
                    if (TavernHelper.getPresetNames().includes(presetName)) {
                        const presetData = TavernHelper.getPreset(presetName);
                        if (presetData) {
                            megaBundle.presets[presetName] = presetData;
                            includedCount++;
                        }
                    }
                }
                toastr.info(`已将 ${includedCount} 个预设文件打包。`);
            }
            else {
                toastr.info('跳过预设文件导出。');
            }
        }
        const includeRegexChoice = await triggerSlash(`/popup okButton="是" cancelButton="否" result=true "是否需要选择一些全局正则脚本一同打包导出？"`);
        if (includeRegexChoice === '1') {
            const allGlobalRegexes = await TavernHelper.getTavernRegexes({ scope: 'global' });
            if (allGlobalRegexes.length === 0) {
                toastr.info('没有可供导出的全局正则脚本。');
            }
            else {
                const selectedRegexes = await (0,___WEBPACK_IMPORTED_MODULE_2__.showRegexExportSelectionPopup)(allGlobalRegexes);
                if (selectedRegexes) {
                    megaBundle.regexData = selectedRegexes;
                    toastr.info(`已将 ${selectedRegexes.length} 条正则打包。`);
                }
                else {
                    toastr.info('已取消选择正则，将不导出任何正则脚本。');
                }
            }
        }
        else {
            toastr.info('跳过正则导出。');
        }
        const defaultFileName = 'MiaoMiao_Batch_Export';
        let userFileName = await triggerSlash(`/input default="${defaultFileName}" "请输入批量导出的文件名（无需后缀）"`);
        if (!userFileName || userFileName.trim() === '') {
            userFileName = defaultFileName;
            toastr.info('文件名为空，已使用默认名称。');
        }
        userFileName = userFileName.trim().replace(/\.json$/, '');
        const jsonString = JSON.stringify(megaBundle, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${userFileName}.json`;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        a.remove();
        toastr.success(`已成功导出 ${selectedConfigs.length} 个配置的整合包。`);
    }
    catch (error) {
        console.error('批量导出失败:', error);
        toastr.error('批量导出失败，请检查控制台。');
    }
}
async function startBatchImportFlow(configsToImport) {
    const userChoices = await (0,___WEBPACK_IMPORTED_MODULE_2__/* .showBatchImportConfigSelectionPopup */ .HA)(configsToImport);
    if (!userChoices) {
        toastr.info('配置导入已取消。');
        return;
    }
    const importList = userChoices.filter((choice) => choice.import);
    if (importList.length === 0) {
        toastr.info('未选择要导入的配置。');
        return;
    }
    const storedConfigs = await (0,___WEBPACK_IMPORTED_MODULE_3__.getStoredConfigs)();
    importList.forEach((choice) => {
        const config = configsToImport.find(c => c.id === choice.originalId);
        if (config) {
            const newConfig = { ...config }; // Create a copy
            newConfig.name = choice.newName;
            newConfig.id = (0,___WEBPACK_IMPORTED_MODULE_0__/* .generateUniqueId */ .Ij)(); // Assign a new unique ID on import
            storedConfigs[newConfig.id] = newConfig;
        }
    });
    await (0,___WEBPACK_IMPORTED_MODULE_3__/* .setStoredConfigs */ .BR)(storedConfigs);
    toastr.success(`成功导入 ${importList.length} 个配置。`);
    await (0,___WEBPACK_IMPORTED_MODULE_3__/* .renderConfigsList */ .sd)();
}
async function handleMegaBundleImport(megaBundle) {
    // 1. 导入预设
    const presetsToImport = megaBundle.presets;
    if (presetsToImport && Object.keys(presetsToImport).length > 0) {
        const presetNames = Object.keys(presetsToImport).join(', ');
        const importPresetChoice = await triggerSlash(`/popup okButton="是" cancelButton="否" result=true "此文件包含预设: ${presetNames}。是否全部导入/覆盖？"`);
        if (importPresetChoice === '1') {
            for (const presetName in presetsToImport) {
                await TavernHelper.createOrReplacePreset(presetName, presetsToImport[presetName]);
            }
            toastr.success(`已导入 ${Object.keys(presetsToImport).length} 个预设。`);
        }
    }
    // 2. 导入正则
    const regexToImport = megaBundle.regexData;
    if (regexToImport && regexToImport.length > 0) {
        const importRegexChoice = await triggerSlash(`/popup okButton="是" cancelButton="否" result=true "此文件包含 ${regexToImport.length} 条正则脚本。是否导入？"`);
        if (importRegexChoice === '1') {
            await (0,___WEBPACK_IMPORTED_MODULE_1__/* .importRegexLogic */ .P)(regexToImport);
        }
    }
    // 3. 导入配置
    const configsToImport = Object.values(megaBundle.presetConfigs);
    await startBatchImportFlow(configsToImport);
}
async function showBatchDeletePopup() {
    const popupId = 'preset-manager-batch-delete-popup';
    $(`#${popupId}`).remove();
    const configs = Object.values(await (0,___WEBPACK_IMPORTED_MODULE_3__.getStoredConfigs)());
    if (configs.length === 0) {
        toastr.info('没有可删除的配置。');
        return;
    }
    const configsHtml = configs
        .map(config => {
        const safeName = $('<div/>').text(config.name).html();
        return `
            <div style="padding: 8px 5px; border-bottom: 1px solid #eee; display: flex; align-items: center;">
                <label style="cursor:pointer; display:flex; align-items:center; width: 100%;">
                    <input type="checkbox" class="pm-batch-delete-item" value="${config.id}" style="margin-right: 10px; transform: scale(1.2);">
                    <span title="${safeName}">${safeName}</span>
                </label>
            </div>
        `;
    })
        .join('');
    const popupHtml = `
        <div id="${popupId}" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: 10001; display: flex; align-items: center; justify-content: center;">
            <div style="background-color: #fff8f0; color: #3a2c2c; border-radius: 16px; padding: 20px; width: 90%; max-width: 450px; box-shadow: 0 4px 25px rgba(120,90,60,.25); display: flex; flex-direction: column; max-height: 80vh;">
                <h4 style="margin-top:0; color:#c62828; text-align: center;">选择要批量删除的配置</h4>
                <div style="margin: 10px 0; display: flex; justify-content: space-around;">
                   <button id="batch-delete-select-all" style="padding: 6px 12px; background-color:#a5d6f9; border:none; border-radius:6px; cursor:pointer;">全选</button>
                   <button id="batch-delete-deselect-all" style="padding: 6px 12px; background-color:#e0e0e0; border:none; border-radius:6px; cursor:pointer;">全不选</button>
                </div>
                <div style="flex: 1; min-height: 0; overflow-y: auto; margin-bottom: 20px; border-top: 1px solid #f0e2d0; border-bottom: 1px solid #f0e2d0; padding: 5px 10px;">
                    ${configsHtml}
                </div>
                <div style="text-align: right; display:flex; justify-content:flex-end; gap: 10px;">
                    <button id="batch-delete-cancel" style="padding: 8px 16px; background-color:#e0e0e0; border:none; border-radius:6px; cursor:pointer; color:#333;">取消</button>
                    <button id="batch-delete-confirm" style="padding: 8px 16px; background-color:#f44336; border:none; border-radius:6px; cursor:pointer; font-weight:bold; color:#fff;">确认删除</button>
                </div>
            </div>
        </div>
    `;
    $('body').append(popupHtml);
    const mobileStyles = `<style>@media (max-width: 600px) { #${popupId} { align-items: flex-start !important; } #${popupId} > div { margin-top: 200px; } }</style>`;
    $(`#${popupId}`).append(mobileStyles);
    $('#batch-delete-select-all').on('click', () => $('.pm-batch-delete-item').prop('checked', true));
    $('#batch-delete-deselect-all').on('click', () => $('.pm-batch-delete-item').prop('checked', false));
    $('#batch-delete-cancel').on('click', () => $(`#${popupId}`).remove());
    $('#batch-delete-confirm').on('click', () => {
        const selectedIds = [];
        $('.pm-batch-delete-item:checked').each(function () {
            selectedIds.push($(this).val());
        });
        batchDeleteConfigs(selectedIds);
        $(`#${popupId}`).remove();
    });
}
async function batchDeleteConfigs(configIds) {
    if (configIds.length === 0) {
        toastr.info('未选择任何要删除的配置。');
        return;
    }
    const confirm = await triggerSlash(`/popup okButton="确认删除" cancelButton="取消" result=true "警告：您确定要删除选中的 ${configIds.length} 个配置吗？此操作无法撤销。"`);
    if (confirm !== '1') {
        toastr.info('批量删除操作已取消。');
        return;
    }
    try {
        const storedConfigs = await (0,___WEBPACK_IMPORTED_MODULE_3__.getStoredConfigs)();
        const idsToDelete = new Set(configIds);
        Object.keys(storedConfigs).forEach(id => {
            if (idsToDelete.has(id))
                delete storedConfigs[id];
        });
        await (0,___WEBPACK_IMPORTED_MODULE_3__/* .setStoredConfigs */ .BR)(storedConfigs);
        toastr.success(`已成功删除 ${configIds.length} 个配置。`);
        await (0,___WEBPACK_IMPORTED_MODULE_3__/* .renderConfigsList */ .sd)();
    }
    catch (error) {
        console.error('批量删除失败:', error);
        toastr.error('批量删除失败，请检查控制台。');
    }
}


/***/ }),

/***/ 780:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HA: () => (/* binding */ showBatchImportConfigSelectionPopup),
/* harmony export */   V9: () => (/* binding */ showHelpPopup),
/* harmony export */   eS: () => (/* binding */ showNewEntriesPopup),
/* harmony export */   rb: () => (/* binding */ showRegexDeletionPopup),
/* harmony export */   showConfigSelectionPopup: () => (/* binding */ showConfigSelectionPopup),
/* harmony export */   showRegexExportSelectionPopup: () => (/* binding */ showRegexExportSelectionPopup),
/* harmony export */   showRemarkPopup: () => (/* binding */ showRemarkPopup),
/* harmony export */   showViewConfigPopup: () => (/* binding */ showViewConfigPopup)
/* harmony export */ });
function showHelpPopup() {
    const popupId = 'preset-manager-help-popup';
    $(`#${popupId}`).remove();
    const helpContent = `
        <div style="padding: 0 10px; font-size: 14px; line-height: 1.6;">
            <h5>主要功能</h5>
            <ul>
                <li><b>保存/更新配置:</b> 保存或更新当前预设中所有"条目"的启用/禁用状态。更新时可选择是否同步正则状态。</li>
                <li><b>加载配置:</b> 一键切换到指定的预设并将所有"条目"恢复到已保存的状态。</li>
                <li><b>查看配置:</b> 在"更多"菜单中点击"查看"，可详细查看配置的基本信息、条目状态统计、启用/禁用的具体条目列表和绑定的正则信息。</li>
                <li><b>条目分组:</b> 可以将预设条目创建分组，分组后的条目会在预设界面中折叠显示，让界面更加整洁。支持创建、移除和清除分组，分组设置会自动保存。</li>
                <li><b>导入/导出:</b> 以 .json 文件的形式分享单个配置。导出时可以为配置包添加备注，方便分享和识别。整合包可以附带预设本身、绑定的正则和分组配置。</li>
                <li><b>兼容世界书导入:</b> 支持直接导入通过酒馆世界书功能导出的、含有本插件数据的备份文件。</li>
                <li><b>批量导入/导出:</b> 一次性分享多个配置、关联的预设和正则脚本，方便备份和迁移。</li>
                <li><b>批量删除:</b> 在主界面勾选多个配置进行一次性删除，方便清理。</li>
                <li><b>角色绑定:</b> 将配置与特定角色关联，切换到该角色时会自动提示加载。</li>
                <li><b>正则绑定:</b> 将配置与一组全局正则的开关状态关联，加载配置时会自动应用。</li>
                <li><b>重命名与分组:</b> 您可以重命名任何配置，同名预设的配置会自动折叠在一个分组下，使界面更清晰。</li>
            </ul>
        </div>
    `;
    const usageNotice = `
        <div style="padding: 12px; font-size: 14px; line-height: 1.6; background-color: #f9f3ea; border-radius: 8px; margin-top: 15px;">
            <h5 style="color: #c62828; margin-top:0;">使用须知</h5>
            <p style="font-weight: bold; margin-bottom: 0;">
                本脚本免费在旅程、喵喵电波服务器发布，作者MoM小n，不允许某个虐男char预设与该作者另一个梦女预设使用，也不支持鉴抄MoM那位的预设使用。
            </p>
        </div>
    `;
    const popupHtml = `
        <div id="${popupId}" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: 10002; display: flex; align-items: center; justify-content: center;">
            <div style="background-color: #fff8f0; color: #3a2c2c; border-radius: 16px; padding: 20px; width: 90%; max-width: 500px; box-shadow: 0 4px 25px rgba(120,90,60,.25); display: flex; flex-direction: column; max-height: 80vh;">
                <h4 style="margin-top:0; color:#6a4226; text-align: center; border-bottom: 2px solid #f0d8b6; padding-bottom: 10px; flex-shrink: 0;">喵喵预设配置管理 - 使用说明</h4>
                <div style="flex: 1; min-height: 0; overflow-y: auto; margin: 15px 0;">
                    ${helpContent}
                </div>
                ${usageNotice}
                <div style="text-align: right; margin-top: 15px; flex-shrink: 0;">
                    <button id="help-popup-close" style="padding: 8px 16px; background-color:#f4c78e; border:none; border-radius:6px; cursor:pointer; font-weight:bold; color:#3a2c2c;">关闭</button>
                </div>
            </div>
        </div>
    `;
    $('body').append(popupHtml);
    const mobileStyles = `<style>@media (max-width: 600px) { #${popupId} { align-items: flex-start !important; } #${popupId} > div { margin-top: 10vh; max-height: 75vh !important; } }</style>`;
    $(`#${popupId}`).append(mobileStyles);
    $('#help-popup-close').on('click', () => $(`#${popupId}`).remove());
}
function showRemarkPopup(remarkText) {
    return new Promise(resolve => {
        const popupId = 'preset-manager-remark-popup';
        $(`#${popupId}`).remove();
        // Simple Markdown to HTML converter
        function convertMarkdown(text) {
            const sanitize = (s) => $('<div/>').text(s).html();
            let lines = text.split('\n');
            let html = '';
            let inList = false;
            const processInline = (line) => {
                return sanitize(line)
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                    .replace(/`(.*?)`/g, '<code>$1</code>');
            };
            for (const line of lines) {
                const trimmedLine = line.trim();
                const isList = trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ');
                if (inList && !isList && trimmedLine) {
                    html += '</ul>';
                    inList = false;
                }
                if (trimmedLine.startsWith('# ')) {
                    html += `<h1>${processInline(trimmedLine.substring(2))}</h1>`;
                }
                else if (trimmedLine.startsWith('## ')) {
                    html += `<h2>${processInline(trimmedLine.substring(3))}</h2>`;
                }
                else if (trimmedLine.startsWith('### ')) {
                    html += `<h3>${processInline(trimmedLine.substring(4))}</h3>`;
                }
                else if (isList) {
                    if (!inList) {
                        html += '<ul>';
                        inList = true;
                    }
                    html += `<li>${processInline(trimmedLine.substring(2))}</li>`;
                }
                else if (trimmedLine) {
                    html += `<p>${processInline(line)}</p>`;
                }
            }
            if (inList)
                html += '</ul>';
            return html;
        }
        const contentHtml = convertMarkdown(remarkText);
        const popupHtml = `
            <div id="${popupId}" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: 10002; display: flex; align-items: center; justify-content: center;">
                <div style="background-color: #fff8f0; color: #3a2c2c; border-radius: 16px; padding: 20px; width: 90%; max-width: 600px; box-shadow: 0 4px 25px rgba(120,90,60,.25); display: flex; flex-direction: column; max-height: 80vh;">
                    <style>
                        #${popupId} .remark-content h1, #${popupId} .remark-content h2, #${popupId} .remark-content h3 { margin: 12px 0 6px 0; padding-bottom: 6px; border-bottom: 1px solid #e0c9a6; }
                        #${popupId} .remark-content h1 { font-size: 1.4em; color: #6a4226; }
                        #${popupId} .remark-content h2 { font-size: 1.2em; color: #7a5235; }
                        #${popupId} .remark-content h3 { font-size: 1.1em; color: #7a5235; }
                        #${popupId} .remark-content p { margin: 0 0 10px 0; }
                        #${popupId} .remark-content ul { margin: 10px 0; padding-left: 25px; }
                        #${popupId} .remark-content li { margin-bottom: 5px; }
                        #${popupId} .remark-content code { background-color: #e0d8cd; padding: 2px 5px; border-radius: 4px; font-family: monospace; color: #3a2c2c; font-size: 0.9em; }
                    </style>
                    <h4 style="margin-top:0; color:#6a4226; text-align: center; border-bottom: 2px solid #f0d8b6; padding-bottom: 10px;">导入备注</h4>
                    <div class="remark-content" style="flex: 1; min-height: 200px; overflow-y: auto; margin: 15px 0; background-color: #fdfaf5; border: 1px solid #f0e2d0; border-radius: 8px; padding: 15px; line-height: 1.6; word-wrap: break-word;">
                        ${contentHtml}
                    </div>
                    <div style="text-align: right;">
                        <button id="remark-popup-continue" style="padding: 8px 16px; background-color:#f4c78e; border:none; border-radius:6px; cursor:pointer; font-weight:bold; color:#3a2c2c;">继续导入</button>
                    </div>
                </div>
            </div>
        `;
        $('body').append(popupHtml);
        const mobileStyles = `<style>@media (max-width: 600px) { #${popupId} { align-items: flex-start !important; } #${popupId} > div { margin-top: 5vh; max-height: 85vh !important; } }</style>`;
        $(`#${popupId}`).append(mobileStyles);
        $('#remark-popup-continue').on('click', () => {
            $(`#${popupId}`).remove();
            resolve(true);
        });
    });
}
function showNewEntriesPopup(newEntries, promptIdToNameMap) {
    return new Promise(resolve => {
        const popupId = 'preset-manager-new-entries-popup';
        $(`#${popupId}`).remove();
        const entriesHtml = newEntries
            .map((entry, index) => {
            const entryName = promptIdToNameMap.get(entry.id) || `未知条目 (ID: ${entry.id})`;
            const isChecked = entry.enabled ? 'checked' : '';
            const safeEntryName = $('<div/>').text(entryName).html();
            return `
                <div class="entry-item" style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #eee;">
                    <label for="new-entry-toggle-${index}" style="cursor: pointer; flex: 1; margin-right: 10px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${safeEntryName}">${safeEntryName}</label>
                    <label class="pm-switch">
                       <input type="checkbox" id="new-entry-toggle-${index}" data-id="${entry.id}" ${isChecked}/>
                       <span class="pm-slider"></span>
                    </label>
                </div>
            `;
        })
            .join('');
        const popupHtml = `
            <div id="${popupId}" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: 10001; display: flex; align-items: center; justify-content: center;">
                <div style="background-color: #fff8f0; color: #3a2c2c; border-radius: 16px; padding: 20px; width: 90%; max-width: 450px; box-shadow: 0 4px 25px rgba(120,90,60,.25); display: flex; flex-direction: column; max-height: 90vh; box-sizing: border-box;">
                    <h4 style="margin-top:0; color:#6a4226; text-align: center;">检测到新条目</h4>
                    <p style="font-size: 14px; color: #6a4226; margin: 10px 0; flex-shrink: 0;">请选择以下新增条目的默认启用状态(勾选为需要启用)：</p>
                    <div style="flex: 1; min-height: 0; overflow-y: auto; margin-bottom: 20px; border-top: 1px solid #f0e2d0; border-bottom: 1px solid #f0e2d0; padding: 5px 10px;">
                        ${entriesHtml}
                    </div>
                    <div class="button-container" style="text-align: right; margin-top: auto; flex-shrink: 0; display:flex; justify-content:flex-end;">
                        <button id="new-entries-cancel" style="padding: 8px 16px; background-color:#e0e0e0; border:none; border-radius:6px; cursor:pointer; color:#333; margin-right: 10px;">取消</button>
                        <button id="new-entries-confirm" style="padding: 8px 16px; background-color:#f4c78e; border:none; border-radius:6px; cursor:pointer; font-weight:bold; color:#3a2c2c;">确认</button>
                    </div>
                </div>
            </div>
        `;
        $('body').append(popupHtml);
        const mobileStyles = `<style>@media (max-width: 600px) {#${popupId} { align-items: flex-start !important; } #${popupId} > div{ margin-top: 5vh; width: 95% !important;max-width: none !important;height: auto !important;max-height: 85vh !important;border-radius: 12px !important;padding: 15px !important;}#${popupId} h4{font-size: 18px !important;margin-bottom: 10px !important;}#${popupId} p{font-size: 14px !important;margin: 5px 0 15px 0 !important;}#${popupId} .entry-item{padding: 10px 0 !important;}#${popupId} .button-container{flex-direction: row !important;gap: 10px !important;justify-content: flex-end;}#${popupId} .button-container button{width: auto !important;margin: 0 !important;flex-grow: 1;}}</style>`;
        $(`#${popupId}`).append(mobileStyles);
        $('#new-entries-confirm').on('click', () => {
            const updatedEntries = newEntries.map((entry, index) => ({
                ...entry,
                enabled: $(`#new-entry-toggle-${index}`).is(':checked'),
            }));
            $(`#${popupId}`).remove();
            resolve(updatedEntries);
        });
        $('#new-entries-cancel').on('click', () => {
            $(`#${popupId}`).remove();
            resolve(null);
        });
    });
}
function showConfigSelectionPopup(configs, charName) {
    return new Promise(resolve => {
        const popupId = 'preset-manager-config-selection-popup';
        $(`#${popupId}`).remove();
        const configsHtml = configs
            .map((config, index) => {
            const safeName = $('<div/>').text(config.name).html();
            return `
                <div class="config-item" style="padding: 10px 5px; border-bottom: 1px solid #eee; cursor: pointer; border-radius: 4px; display: flex; align-items: center;">
                    <input type="radio" id="config-select-${index}" name="config-selection" value="${config.id}" style="margin-right: 10px; transform: scale(1.2);">
                    <label for="config-select-${index}" style="cursor: pointer; width: 100%;">${safeName}</label>
                </div>
            `;
        })
            .join('');
        const popupHtml = `
            <div id="${popupId}" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: 10001; display: flex; align-items: center; justify-content: center;">
                <div style="background-color: #fff8f0; color: #3a2c2c; border-radius: 16px; padding: 20px; width: 90%; max-width: 400px; box-shadow: 0 4px 25px rgba(120,90,60,.25); display: flex; flex-direction: column; max-height: 90vh;">
                    <h4 style="margin-top:0; color:#6a4226; text-align: center; border-bottom: 2px solid #f0d8b6; padding-bottom: 10px;">选择配置</h4>
                    <p style="font-size: 14px; color: #6a4226; margin: 15px 0; text-align: center;">角色 "${$('<div/>').text(charName).html()}" 绑定了多个配置，请选择一个进行加载：</p>
                    <div style="flex: 1; min-height: 0; overflow-y: auto; margin-bottom: 20px; padding: 5px;">
                        ${configsHtml}
                    </div>
                    <div style="text-align: right; display:flex; justify-content:flex-end; gap: 10px;">
                        <button id="config-select-cancel" style="padding: 8px 16px; background-color:#e0e0e0; border:none; border-radius:6px; cursor:pointer; color:#333;">取消</button>
                        <button id="config-select-confirm" style="padding: 8px 16px; background-color:#f4c78e; border:none; border-radius:6px; cursor:pointer; font-weight:bold; color:#3a2c2c;">加载</button>
                    </div>
                </div>
            </div>
        `;
        $('body').append(popupHtml);
        const mobileStyles = `<style> @media (max-width: 600px) { #${popupId} { align-items: flex-start !important; } #${popupId} > div { margin-top: 5vh; max-height: 85vh !important; } }</style>`;
        $(`#${popupId}`).append(mobileStyles);
        if (configs.length > 0)
            $(`#config-select-0`).prop('checked', true);
        $(`#${popupId} .config-item`).on('click', function () {
            $(this).find('input[type="radio"]').prop('checked', true);
        });
        $('#config-select-confirm').on('click', () => {
            const selectedId = $('input[name="config-selection"]:checked').val();
            if (selectedId) {
                $(`#${popupId}`).remove();
                resolve(selectedId);
            }
            else {
                toastr.warning('请选择一个配置。');
            }
        });
        $('#config-select-cancel').on('click', () => {
            $(`#${popupId}`).remove();
            resolve(null);
        });
    });
}
function showRegexExportSelectionPopup(boundRegexes) {
    return new Promise(resolve => {
        const popupId = 'preset-manager-regex-export-popup';
        $(`#${popupId}`).remove();
        const regexesHtml = boundRegexes
            .map(regex => {
            const safeName = $('<div/>').text(regex.script_name).html();
            return `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 5px; border-bottom: 1px solid #eee;">
                    <label for="regex-export-toggle-${regex.id}" style="cursor: pointer; flex: 1; margin-right: 10px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${safeName}">${safeName}</label>
                    <label class="pm-switch">
                       <input type="checkbox" class="regex-export-checkbox" id="regex-export-toggle-${regex.id}" data-id="${regex.id}" checked/>
                       <span class="pm-slider"></span>
                    </label>
                </div>
            `;
        })
            .join('');
        const popupHtml = `
            <div id="${popupId}" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: 10001; display: flex; align-items: center; justify-content: center;">
                <div style="background-color: #fff8f0; color: #3a2c2c; border-radius: 16px; padding: 20px; width: 90%; max-width: 450px; box-shadow: 0 4px 25px rgba(120,90,60,.25); display: flex; flex-direction: column; max-height: 80vh;">
                    <h4 style="margin-top:0; color:#6a4226; text-align: center;">选择要导出的正则</h4>
                    <div style="margin: 10px 0; display: flex; justify-content: space-around;">
                       <button id="regex-export-select-all" style="padding: 6px 12px; background-color:#a5d6f9; border:none; border-radius:6px; cursor:pointer;">全选</button>
                       <button id="regex-export-deselect-all" style="padding: 6px 12px; background-color:#e0e0e0; border:none; border-radius:6px; cursor:pointer;">全不选</button>
                    </div>
                    <div style="flex: 1; min-height: 0; overflow-y: auto; margin-bottom: 20px; border-top: 1px solid #f0e2d0; border-bottom: 1px solid #f0e2d0; padding: 5px 10px;">
                        ${regexesHtml}
                    </div>
                    <div style="text-align: right; display:flex; justify-content:flex-end; gap: 10px;">
                        <button id="regex-export-cancel" style="padding: 8px 16px; background-color:#e0e0e0; border:none; border-radius:6px; cursor:pointer; color:#333;">取消</button>
                        <button id="regex-export-confirm" style="padding: 8px 16px; background-color:#f4c78e; border:none; border-radius:6px; cursor:pointer; font-weight:bold; color:#3a2c2c;">确认导出</button>
                    </div>
                </div>
            </div>
        `;
        $('body').append(popupHtml);
        const mobileStyles = `<style>@media (max-width: 600px) { #${popupId} { align-items: flex-start !important; } #${popupId} > div { margin-top: 5vh; } }</style>`;
        $(`#${popupId}`).append(mobileStyles);
        $('#regex-export-select-all').on('click', () => $('.regex-export-checkbox').prop('checked', true));
        $('#regex-export-deselect-all').on('click', () => $('.regex-export-checkbox').prop('checked', false));
        $('#regex-export-cancel').on('click', () => {
            $(`#${popupId}`).remove();
            resolve(null);
        });
        $('#regex-export-confirm').on('click', () => {
            const selectedIds = new Set();
            $('.regex-export-checkbox:checked').each(function () {
                selectedIds.add($(this).data('id'));
            });
            const selectedRegexes = boundRegexes.filter(r => selectedIds.has(r.id));
            $(`#${popupId}`).remove();
            resolve(selectedRegexes);
        });
    });
}
function showRegexDeletionPopup(existingRegexes) {
    return new Promise(resolve => {
        const popupId = 'preset-manager-regex-delete-popup';
        $(`#${popupId}`).remove();
        const regexesHtml = existingRegexes
            .map(regex => {
            const safeName = $('<div/>').text(regex.script_name).html();
            return `
                <div style="display: flex; align-items: center; padding: 10px 5px; border-bottom: 1px solid #eee;">
                    <input type="checkbox" class="regex-delete-checkbox" id="regex-delete-toggle-${regex.id}" data-id="${regex.id}" style="margin-right: 15px; transform: scale(1.3);">
                    <label for="regex-delete-toggle-${regex.id}" style="cursor: pointer; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${safeName}">${safeName}</label>
                </div>
            `;
        })
            .join('');
        const popupHtml = `
            <div id="${popupId}" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: 10002; display: flex; align-items: center; justify-content: center;">
                <div style="background-color: #fff8f0; color: #3a2c2c; border-radius: 16px; padding: 20px; width: 90%; max-width: 450px; box-shadow: 0 4px 25px rgba(120,90,60,.25); display: flex; flex-direction: column; max-height: 80vh;">
                    <h4 style="margin-top:0; color:#c62828; text-align: center;">删除已有正则 (可选)</h4>
                    <p style="font-size: 13px; color: #777; text-align: center; margin-bottom: 15px;">在导入新正则前，你可以选择删除一些不再需要的旧正则。</p>
                    <div style="flex: 1; min-height: 0; overflow-y: auto; margin-bottom: 20px; border-top: 1px solid #f0e2d0; border-bottom: 1px solid #f0e2d0; padding: 5px 10px;">
                        ${regexesHtml}
                    </div>
                    <div style="text-align: right; display:flex; justify-content:flex-end; gap: 10px;">
                        <button id="regex-delete-skip" style="padding: 8px 16px; background-color:#e0e0e0; border:none; border-radius:6px; cursor:pointer; color:#333;">跳过并导入</button>
                        <button id="regex-delete-confirm" style="padding: 8px 16px; background-color:#f5a8a0; border:none; border-radius:6px; cursor:pointer; font-weight:bold; color:#fff;">删除选中并导入</button>
                    </div>
                </div>
            </div>
        `;
        $('body').append(popupHtml);
        const mobileStyles = `<style>@media (max-width: 600px) { #${popupId} { align-items: flex-start !important; } #${popupId} > div { margin-top: 5vh; } }</style>`;
        $(`#${popupId}`).append(mobileStyles);
        $('#regex-delete-skip').on('click', () => {
            $(`#${popupId}`).remove();
            resolve(existingRegexes);
        });
        $('#regex-delete-confirm').on('click', () => {
            const idsToDelete = new Set();
            $('.regex-delete-checkbox:checked').each(function () {
                idsToDelete.add($(this).data('id'));
            });
            const remainingRegexes = existingRegexes.filter(r => !idsToDelete.has(r.id));
            if (idsToDelete.size > 0) {
                toastr.info(`已删除 ${idsToDelete.size} 条旧正则。`);
            }
            $(`#${popupId}`).remove();
            resolve(remainingRegexes);
        });
    });
}
function showBatchImportConfigSelectionPopup(configsToImport) {
    return new Promise(resolve => {
        const popupId = 'preset-manager-batch-import-popup';
        $(`#${popupId}`).remove();
        const configsHtml = configsToImport
            .map(config => {
            const safeName = $('<div/>').text(config.name).html();
            return `
                <div style="padding: 8px 5px; border-bottom: 1px solid #eee; display: flex; align-items: center; gap: 10px;">
                    <input type="checkbox" class="pm-batch-import-checkbox" data-original-id="${config.id}" checked style="transform: scale(1.2);">
                    <label style="font-weight: bold; flex-shrink: 0;" title="${safeName}">${safeName}</label>
                    <input type="text" class="pm-batch-import-newname" value="${safeName}" style="flex: 1; min-width: 100px; background-color: #fff; border: 1px solid #d4b58b; color:#3a2c2c; padding: 4px 6px; border-radius: 4px; font-size:13px;">
                </div>
            `;
        })
            .join('');
        const popupHtml = `
             <div id="${popupId}" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: 10001; display: flex; align-items: center; justify-content: center;">
                <div style="background-color: #fff8f0; color: #3a2c2c; border-radius: 16px; padding: 20px; width: 90%; max-width: 500px; box-shadow: 0 4px 25px rgba(120,90,60,.25); display: flex; flex-direction: column; max-height: 80vh;">
                    <h4 style="margin-top:0; color:#6a4226; text-align: center;">选择要导入的配置</h4>
                    <p style="font-size: 13px; color: #777; text-align: center; margin-bottom: 15px;">勾选要导入的配置，可修改导入后的名称。</p>
                    <div style="flex: 1; min-height: 0; overflow-y: auto; margin-bottom: 20px; border-top: 1px solid #f0e2d0; border-bottom: 1px solid #f0e2d0; padding: 5px 10px;">
                        ${configsHtml}
                    </div>
                    <div style="text-align: right; display:flex; justify-content:flex-end; gap: 10px;">
                        <button id="batch-import-cancel" style="padding: 8px 16px; background-color:#e0e0e0; border:none; border-radius:6px; cursor:pointer; color:#333;">取消</button>
                        <button id="batch-import-confirm" style="padding: 8px 16px; background-color:#f4c78e; border:none; border-radius:6px; cursor:pointer; font-weight:bold; color:#3a2c2c;">导入选中项</button>
                    </div>
                </div>
            </div>
        `;
        $('body').append(popupHtml);
        const mobileStyles = `<style>
            @media (max-width: 600px) { #${popupId} > div { margin-top: 600px; } }
        </style>`;
        $(`#${popupId}`).append(mobileStyles);
        $('#batch-import-cancel').on('click', () => {
            $(`#${popupId}`).remove();
            resolve(null);
        });
        $('#batch-import-confirm').on('click', () => {
            const choices = [];
            let hasError = false;
            $('#preset-manager-batch-import-popup .pm-batch-import-checkbox').each(function () {
                const checkbox = $(this);
                const newName = checkbox.siblings('.pm-batch-import-newname').val()?.toString().trim();
                if (!newName && checkbox.is(':checked')) {
                    toastr.error(`有已勾选的配置新名称为空。`);
                    hasError = true;
                    return false;
                }
                choices.push({
                    originalId: checkbox.data('original-id'),
                    newName: newName,
                    import: checkbox.is(':checked'),
                });
            });
            if (!hasError) {
                $(`#${popupId}`).remove();
                resolve(choices);
            }
        });
    });
}
// 显示查看配置弹窗
async function showViewConfigPopup(configId) {
    const { getStoredConfigs } = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 320));
    const configs = await getStoredConfigs();
    const configData = configs[configId];
    if (!configData) {
        toastr.error('配置不存在');
        return;
    }
    // 获取所有正则信息，用于显示名称
    let allRegexes = [];
    try {
        allRegexes = await TavernHelper.getTavernRegexes({ scope: 'global' });
    }
    catch (error) {
        console.warn('获取正则信息失败:', error);
    }
    const popupId = 'preset-manager-view-config-popup';
    $(`#${popupId}`).remove();
    // 统计配置信息
    const totalStates = configData.states.length;
    const enabledStates = configData.states.filter((state) => state.enabled).length;
    const disabledStates = totalStates - enabledStates;
    // 分组显示状态
    const enabledStatesHtml = configData.states
        .filter((state) => state.enabled)
        .map((state) => `<div style="padding: 4px 8px; margin: 2px; background-color: #e8f5e8; border-radius: 4px; font-size: 12px;">${$('<div/>').text(state.name).html()}</div>`)
        .join('');
    const disabledStatesHtml = configData.states
        .filter((state) => !state.enabled)
        .map((state) => `<div style="padding: 4px 8px; margin: 2px; background-color: #ffebee; border-radius: 4px; font-size: 12px;">${$('<div/>').text(state.name).html()}</div>`)
        .join('');
    // 正则绑定信息
    const regexInfo = configData.regexStates && configData.regexStates.length > 0
        ? `<div style="margin-top: 15px;">
         <h5 style="color: #6a4226; margin-bottom: 8px;">绑定正则 (${configData.regexStates.length}个)</h5>
         <div class="item-list" style="max-height: 100px; overflow-y: auto; border: 1px solid #e0c9a6; border-radius: 4px; padding: 8px;">
           ${configData.regexStates
            .map((regex) => {
            // 从所有正则中查找对应的正则信息
            const fullRegexInfo = allRegexes.find(r => r.id === regex.id);
            const regexName = fullRegexInfo?.script_name ||
                fullRegexInfo?.scriptName ||
                regex.scriptName ||
                regex.script_name ||
                regex.name ||
                `正则ID: ${regex.id}`;
            return `<div style="padding: 4px 8px; margin: 2px; background-color: ${regex.enabled ? '#e3f2fd' : '#fafafa'}; border-radius: 4px; font-size: 12px;">
                ${$('<div/>').text(regexName).html()} ${regex.enabled ? '(启用)' : '(禁用)'}
              </div>`;
        })
            .join('')}
         </div>
       </div>`
        : '';
    const popupHtml = `
    <div id="${popupId}" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: 10002; display: flex; align-items: center; justify-content: center;">
      <div style="background-color: #fff8f0; color: #3a2c2c; border-radius: 16px; padding: 20px; width: 90%; max-width: 600px; box-shadow: 0 4px 25px rgba(120,90,60,.25); display: flex; flex-direction: column; max-height: 80vh;">
        <h4 style="margin-top:0; color:#6a4226; text-align: center; border-bottom: 2px solid #f0d8b6; padding-bottom: 10px;">查看配置详情</h4>
        
        <div style="flex: 1; min-height: 0; overflow-y: auto; margin: 15px 0;">
          <div style="margin-bottom: 15px;">
            <h5 style="color: #6a4226; margin-bottom: 8px;">基本信息</h5>
            <div style="background-color: #f9f3ea; padding: 10px; border-radius: 6px;">
              <div><strong>配置名称:</strong> ${$('<div/>').text(configData.name).html()}</div>
              <div><strong>关联预设:</strong> ${$('<div/>').text(configData.presetName).html()}</div>
              <div><strong>创建时间:</strong> ${new Date(configData.id).toLocaleString()}</div>
              ${configData.boundCharName ? `<div><strong>绑定角色:</strong> <span style="color: #4CAF50;">${$('<div/>').text(configData.boundCharName).html()}</span></div>` : ''}
            </div>
          </div>

          <div style="margin-bottom: 15px;">
            <h5 style="color: #6a4226; margin-bottom: 8px;">条目状态统计</h5>
            <div class="stats-container" style="display: flex; gap: 10px; margin-bottom: 10px;">
              <div class="stats-item" style="background-color: #e8f5e8; padding: 8px; border-radius: 6px; flex: 1; text-align: center;">
                <div style="font-weight: bold; color: #2e7d32;">启用</div>
                <div style="font-size: 18px; font-weight: bold;">${enabledStates}</div>
              </div>
              <div class="stats-item" style="background-color: #ffebee; padding: 8px; border-radius: 6px; flex: 1; text-align: center;">
                <div style="font-weight: bold; color: #c62828;">禁用</div>
                <div style="font-size: 18px; font-weight: bold;">${disabledStates}</div>
              </div>
              <div class="stats-item" style="background-color: #f0f4f8; padding: 8px; border-radius: 6px; flex: 1; text-align: center;">
                <div style="font-weight: bold; color: #546e7a;">总计</div>
                <div style="font-size: 18px; font-weight: bold;">${totalStates}</div>
              </div>
            </div>
          </div>

          ${enabledStates > 0
        ? `
          <div style="margin-bottom: 15px;">
            <h5 style="color: #6a4226; margin-bottom: 8px;">启用的条目 (${enabledStates}个)</h5>
            <div class="item-list" style="max-height: 150px; overflow-y: auto; border: 1px solid #e0c9a6; border-radius: 4px; padding: 8px;">
              ${enabledStatesHtml}
            </div>
          </div>
          `
        : ''}

          ${disabledStates > 0
        ? `
          <div style="margin-bottom: 15px;">
            <h5 style="color: #6a4226; margin-bottom: 8px;">禁用的条目 (${disabledStates}个)</h5>
            <div class="item-list" style="max-height: 150px; overflow-y: auto; border: 1px solid #e0c9a6; border-radius: 4px; padding: 8px;">
              ${disabledStatesHtml}
            </div>
          </div>
          `
        : ''}

          ${regexInfo}
        </div>

        <div style="text-align: right; margin-top: 15px; display: flex; gap: 10px; justify-content: flex-end;">
          <button id="view-config-load" data-id="${configId}" style="padding: 8px 16px; background-color:#4CAF50; border:none; border-radius:6px; cursor:pointer; font-weight:bold; color:#fff;">加载此配置</button>
          <button id="view-config-close" style="padding: 8px 16px; background-color:#f4c78e; border:none; border-radius:6px; cursor:pointer; font-weight:bold; color:#3a2c2c;">关闭</button>
        </div>
      </div>
    </div>
  `;
    $('body').append(popupHtml);
    // 绑定事件
    $('#view-config-close').on('click', () => {
        $(`#${popupId}`).remove();
    });
    $('#view-config-load').on('click', async () => {
        const configId = $('#view-config-load').data('id');
        $(`#${popupId}`).remove();
        const { loadConfig } = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 884));
        await loadConfig(configId);
    });
    // 移动端样式
    const mobileStyles = `<style>
    @media (max-width: 600px) { 
      #${popupId} { 
        align-items: flex-start !important; 
        padding: 10px;
      } 
      #${popupId} > div { 
        margin-top: 5vh; 
        max-height: 90vh !important; 
        width: 95% !important;
        padding: 15px;
        border-radius: 12px;
      }
      #${popupId} h4 {
        font-size: 18px !important;
        margin-bottom: 15px !important;
      }
      #${popupId} h5 {
        font-size: 15px !important;
        margin-bottom: 10px !important;
      }
      #${popupId} button {
        font-size: 14px !important;
        padding: 10px 16px !important;
        min-height: 44px;
      }
      #${popupId} .stats-container {
        flex-direction: column !important;
        gap: 8px !important;
      }
      #${popupId} .stats-item {
        flex: none !important;
        padding: 12px !important;
      }
      #${popupId} .item-list {
        max-height: 120px !important;
        font-size: 13px !important;
      }
      #${popupId} .item-list div {
        padding: 6px 10px !important;
        margin: 3px !important;
        font-size: 12px !important;
      }
    }
    @media (max-width: 480px) {
      #${popupId} > div {
        margin-top: 2vh !important;
        max-height: 96vh !important;
        padding: 12px;
      }
      #${popupId} h4 {
        font-size: 16px !important;
      }
      #${popupId} .stats-item {
        padding: 10px !important;
      }
      #${popupId} .stats-item div:first-child {
        font-size: 13px !important;
      }
      #${popupId} .stats-item div:last-child {
        font-size: 16px !important;
      }
    }
  </style>`;
    $(`#${popupId}`).append(mobileStyles);
}


/***/ }),

/***/ 884:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* binding */ saveCurrentConfig),
/* harmony export */   deleteConfig: () => (/* binding */ deleteConfig),
/* harmony export */   loadConfig: () => (/* binding */ loadConfig),
/* harmony export */   renameConfig: () => (/* binding */ renameConfig),
/* harmony export */   updateConfig: () => (/* binding */ updateConfig)
/* harmony export */ });
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(291);
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(574);
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(780);
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(320);




async function renameConfig(configId) {
    const configs = await (0,___WEBPACK_IMPORTED_MODULE_3__.getStoredConfigs)();
    const configToRename = configs[configId];
    if (!configToRename) {
        toastr.error('找不到要重命名的配置。');
        return;
    }
    const oldName = configToRename.name;
    const newName = await triggerSlash(`/input default="${oldName}" "请输入新的配置名称"`);
    if (newName && newName.trim() !== '') {
        configs[configId].name = newName.trim();
        await (0,___WEBPACK_IMPORTED_MODULE_3__/* .setStoredConfigs */ .BR)(configs);
        (0,___WEBPACK_IMPORTED_MODULE_3__/* .clearConfigCache */ .ih)(); // 清除配置缓存
        toastr.success(`配置已从 "${oldName}" 重命名为 "${newName.trim()}"。`);
        await (0,___WEBPACK_IMPORTED_MODULE_3__/* .renderConfigsList */ .sd)();
        (0,___WEBPACK_IMPORTED_MODULE_1__/* .updateConfigListCache */ .oz)(); // 更新UI缓存
    }
    else {
        toastr.info('重命名操作已取消。');
    }
}
async function updateConfig(configId) {
    try {
        const configs = await (0,___WEBPACK_IMPORTED_MODULE_3__.getStoredConfigs)();
        const oldConfig = configs[configId];
        if (!oldConfig) {
            toastr.error(`配置不存在，无法更新。`);
            return;
        }
        const loadedPresetName = TavernHelper.getLoadedPresetName();
        const preset = TavernHelper.getPreset('in_use');
        const allPrompts = [...preset.prompts, ...preset.prompts_unused];
        const currentPromptStates = allPrompts.map((p) => ({
            id: p.id,
            enabled: p.enabled,
            name: p.name,
        }));
        const configToSave = {
            ...oldConfig,
            presetName: loadedPresetName,
            states: currentPromptStates,
        };
        const updateRegexChoice = await triggerSlash(`/popup okButton="是" cancelButton="否" result=true "是否要同时更新此配置的正则开关状态？"`);
        if (updateRegexChoice === '1') {
            const allRegexes = await TavernHelper.getTavernRegexes({ scope: 'global' });
            const newRegexStates = allRegexes.map((regex) => ({
                id: regex.id,
                enabled: regex.enabled,
            }));
            configToSave.regexStates = newRegexStates;
            toastr.info('已同步更新正则状态。');
        }
        const oldStateIds = new Set(oldConfig.states.map(s => s.id));
        const newEntries = configToSave.states.filter(s => !oldStateIds.has(s.id));
        if (newEntries.length > 0) {
            const promptIdToNameMap = new Map(currentPromptStates.map((p) => [p.id, p.name]));
            const userChoices = await (0,___WEBPACK_IMPORTED_MODULE_2__/* .showNewEntriesPopup */ .eS)(newEntries, promptIdToNameMap);
            if (userChoices !== null) {
                const choicesMap = new Map(userChoices.map((choice) => [choice.id, choice.enabled]));
                configToSave.states.forEach(state => {
                    if (choicesMap.has(state.id))
                        state.enabled = choicesMap.get(state.id);
                });
            }
            else {
                toastr.info('已为新条目保留默认状态。');
            }
        }
        configs[configId] = configToSave;
        await (0,___WEBPACK_IMPORTED_MODULE_3__/* .setStoredConfigs */ .BR)(configs);
        (0,___WEBPACK_IMPORTED_MODULE_3__/* .clearConfigCache */ .ih)(); // 清除配置缓存
        toastr.success(`配置 "${configToSave.name}" 已更新。`);
        await (0,___WEBPACK_IMPORTED_MODULE_3__/* .renderConfigsList */ .sd)();
        (0,___WEBPACK_IMPORTED_MODULE_1__/* .updateConfigListCache */ .oz)(); // 更新UI缓存
    }
    catch (error) {
        console.error('更新预设配置失败:', error);
        toastr.error('更新预设配置失败，请检查控制台获取更多信息。');
    }
}
async function saveCurrentConfig() {
    const loadedPresetName = TavernHelper.getLoadedPresetName();
    const blacklist = ['恶灵低语', 'deepspay', 'spaymale', '深阉', '小骡之神', '小猫之神', 'kemini'];
    if (blacklist.some(keyword => loadedPresetName.toLowerCase().includes(keyword))) {
        toastr.warning('*你使用了作者黑名单的预设哦（盯）*');
        return;
    }
    const nameInput = $('#preset-manager-name-input');
    const configName = nameInput.val()?.toString().trim();
    if (!configName) {
        toastr.error('请输入配置名称。');
        return;
    }
    try {
        const preset = TavernHelper.getPreset('in_use');
        const allPrompts = [...preset.prompts, ...preset.prompts_unused];
        const promptStates = allPrompts.map((p) => ({
            id: p.id,
            enabled: p.enabled,
            name: p.name,
        }));
        const configToSave = {
            id: (0,___WEBPACK_IMPORTED_MODULE_0__/* .generateUniqueId */ .Ij)(),
            name: configName,
            presetName: loadedPresetName,
            states: promptStates,
        };
        if ($('#preset-manager-bind-char').is(':checked')) {
            const charData = await TavernHelper.getCharData('current');
            if (charData && charData.avatar) {
                configToSave.boundCharAvatar = charData.avatar;
                configToSave.boundCharName = charData.name;
            }
            else {
                toastr.warning('无法获取当前角色信息，配置未绑定。');
            }
        }
        const configs = await (0,___WEBPACK_IMPORTED_MODULE_3__.getStoredConfigs)();
        configs[configToSave.id] = configToSave;
        await (0,___WEBPACK_IMPORTED_MODULE_3__/* .setStoredConfigs */ .BR)(configs);
        (0,___WEBPACK_IMPORTED_MODULE_3__/* .clearConfigCache */ .ih)(); // 清除配置缓存
        toastr.success(`配置 "${configName}" 已保存。`);
        nameInput.val('');
        $('#preset-manager-bind-char').prop('checked', false);
        await (0,___WEBPACK_IMPORTED_MODULE_3__/* .renderConfigsList */ .sd)();
        (0,___WEBPACK_IMPORTED_MODULE_1__/* .updateConfigListCache */ .oz)(); // 更新UI缓存
    }
    catch (error) {
        console.error('保存预设配置失败:', error);
        toastr.error('保存预设配置失败，请检查控制台获取更多信息。');
    }
}
async function loadConfig(configId, shouldToggleUI = true) {
    try {
        const configs = await (0,___WEBPACK_IMPORTED_MODULE_3__.getStoredConfigs)();
        const configToLoad = configs[configId];
        if (!configToLoad) {
            toastr.error(`配置不存在。`);
            return;
        }
        if (configToLoad.presetName) {
            if (TavernHelper.getPresetNames().includes(configToLoad.presetName)) {
                if (TavernHelper.loadPreset(configToLoad.presetName)) {
                    toastr.info(`已切换到预设 "${configToLoad.presetName}"。`);
                    await new Promise(resolve => setTimeout(resolve, 150));
                }
                else {
                    toastr.error(`加载预设 "${configToLoad.presetName}" 失败。`);
                    return;
                }
            }
            else {
                toastr.warning(`配置关联的预设 "${configToLoad.presetName}" 不存在。将仅对当前预设应用条目状态。`);
            }
        }
        const promptStates = configToLoad.states;
        if (!promptStates || !Array.isArray(promptStates)) {
            toastr.error(`配置 "${configToLoad.name}" 数据格式不正确或为空。`);
            return;
        }
        const statesMap = new Map(promptStates.map(s => [s.id, s.enabled]));
        await TavernHelper.updatePresetWith('in_use', preset => {
            [...preset.prompts, ...preset.prompts_unused].forEach((prompt) => {
                if (statesMap.has(prompt.id))
                    prompt.enabled = statesMap.get(prompt.id);
            });
            return preset;
        });
        if (configToLoad.regexStates && Array.isArray(configToLoad.regexStates)) {
            const statesToApply = new Map(configToLoad.regexStates.map(r => [r.id, r.enabled]));
            if (statesToApply.size > 0) {
                await TavernHelper.updateTavernRegexesWith(regexes => {
                    regexes.forEach((regex) => {
                        if (regex.scope === 'global' && statesToApply.has(regex.id)) {
                            regex.enabled = statesToApply.get(regex.id);
                        }
                    });
                    return regexes;
                }, { scope: 'global' });
                toastr.success(`已应用配置 "${configToLoad.name}" 绑定的全局正则。`);
            }
        }
        toastr.success(`已加载配置 "${configToLoad.name}"。`);
        if (shouldToggleUI) {
            (0,___WEBPACK_IMPORTED_MODULE_1__/* .toggleUI */ .jS)();
        }
    }
    catch (error) {
        console.error('加载预设配置失败:', error);
        toastr.error('加载预设配置失败，请检查控制台获取更多信息。');
    }
}
async function deleteConfig(configId) {
    try {
        const configs = await (0,___WEBPACK_IMPORTED_MODULE_3__.getStoredConfigs)();
        const configToDelete = configs[configId];
        if (configToDelete) {
            delete configs[configId];
            await (0,___WEBPACK_IMPORTED_MODULE_3__/* .setStoredConfigs */ .BR)(configs);
            (0,___WEBPACK_IMPORTED_MODULE_3__/* .clearConfigCache */ .ih)(); // 清除配置缓存
            toastr.success(`已删除配置 "${configToDelete.name}"。`);
            await (0,___WEBPACK_IMPORTED_MODULE_3__/* .renderConfigsList */ .sd)();
            (0,___WEBPACK_IMPORTED_MODULE_1__/* .updateConfigListCache */ .oz)(); // 更新UI缓存
        }
        else {
            toastr.warning(`配置不存在。`);
        }
    }
    catch (error) {
        console.error('删除配置失败:', error);
        toastr.error('删除配置失败，请检查控制台获取更多信息。');
    }
}


/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/******/ /* webpack/runtime/make namespace object */
/******/ (() => {
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ })();
/******/ 
/************************************************************************/
var __webpack_exports__ = {};

// EXTERNAL MODULE: ./src/喵喵预设配置管理/初始化和配置.ts
var _ = __webpack_require__(291);
// EXTERNAL MODULE: ./src/喵喵预设配置管理/条目分组功能.ts
var src_ = __webpack_require__(11);
// EXTERNAL MODULE: ./src/喵喵预设配置管理/界面创建和管理.ts
var src_0 = __webpack_require__(574);
// EXTERNAL MODULE: ./src/喵喵预设配置管理/配置存储和读取.ts
var src_1 = __webpack_require__(320);
// EXTERNAL MODULE: ./src/喵喵预设配置管理/配置操作功能.ts
var src_2 = __webpack_require__(884);
;// ./src/喵喵预设配置管理/角色绑定功能.ts



async function onChatChanged() {
    try {
        await new Promise(resolve => setTimeout(resolve, 250));
        const charData = await TavernHelper.getCharData('current');
        if (!charData || !charData.avatar || charData.avatar === _/* lastProcessedCharAvatar */.Mk) {
            if (!charData || !charData.avatar)
                (0,_/* setLastProcessedCharAvatar */.iu)(null);
            return;
        }
        (0,_/* setLastProcessedCharAvatar */.iu)(charData.avatar);
        const configs = await (0,src_1.getStoredConfigs)();
        const boundConfigs = Object.values(configs).filter(config => config.boundCharAvatar === charData.avatar);
        if (boundConfigs.length === 0)
            return;
        let configIdToLoad = null;
        if (boundConfigs.length === 1) {
            const singleConfig = boundConfigs[0];
            const popupText = `角色 "${charData.name}" 拥有绑定的配置 "${singleConfig.name}"。是否要加载此配置？`;
            const userChoice = await triggerSlash(`/popup okButton="加载" cancelButton="取消" result=true "${popupText}"`);
            if (userChoice === '1')
                configIdToLoad = singleConfig.id;
        }
        else {
            const { showConfigSelectionPopup } = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 780));
            configIdToLoad = await showConfigSelectionPopup(boundConfigs, charData.name);
        }
        if (configIdToLoad)
            await (0,src_2.loadConfig)(configIdToLoad, false);
    }
    catch (error) {
        console.error('检查绑定配置时出错:', error);
        toastr.error('检查角色绑定配置时出错。');
    }
}

;// ./src/喵喵预设配置管理/加载和卸载时执行函数.ts




// 防止重复初始化的全局标记
const SCRIPT_ID = 'MIAO_MIAO_PRESET_MANAGER';
// 等待必要的全局变量加载完成
function checkReady() {
    const win = window;
    if (win.jQuery &&
        win.TavernHelper &&
        typeof TavernHelper.createOrReplaceWorldbook === 'function' &&
        win.tavern_events &&
        typeof getButtonEvent === 'function') {
        initScript();
    }
    else {
        setTimeout(checkReady, 100);
    }
}
function init() {
    // 简化重复检查 - 只检查UI是否已存在，如果存在就跳过初始化
    const win = window;
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
async function initScript() {
    try {
        console.log('🚀 喵喵预设配置管理开始初始化...');
        // 初始化配置管理器
        await (0,_/* initializePresetManager */.xd)();
        console.log('✅ 配置管理器初始化完成');
        // 创建UI界面
        (0,src_0/* createUI */.RD)();
        console.log('✅ UI界面创建完成');
        // 注册按钮事件
        const buttonEventId = getButtonEvent(_/* TOGGLE_BUTTON_NAME */.EF);
        eventOn(buttonEventId, src_0/* toggleUI */.jS);
        console.log('✅ 按钮事件已注册:', buttonEventId);
        // 注册角色切换事件
        eventOn(tavern_events.CHAT_CHANGED, onChatChanged);
        // 延迟加载非关键功能，避免阻塞UI
        setTimeout(() => {
            initNonCriticalFeatures();
        }, 100);
        console.log('✅ 喵喵预设配置管理已加载成功!');
    }
    catch (error) {
        console.error('初始化喵喵预设配置管理失败:', error);
        toastr.error('喵喵预设配置管理加载失败，请检查控制台');
    }
}
// 初始化非关键功能，避免阻塞主UI
function initNonCriticalFeatures() {
    try {
        // 恢复分组配置
        eventOn(tavern_events.SETTINGS_LOADED, src_/* restoreGroupingFromConfig */.Ec);
        // 监听预设变化，如果存在该事件的话
        const tavernEventsExt = tavern_events;
        if (tavernEventsExt.PRESET_CHANGED) {
            eventOn(tavernEventsExt.PRESET_CHANGED, src_/* restoreGroupingFromConfig */.Ec);
        }
        // 监听预设界面变化，延迟恢复分组
        if (tavernEventsExt.PROMPT_MANAGER_UPDATED) {
            eventOn(tavernEventsExt.PROMPT_MANAGER_UPDATED, () => (0,src_/* restoreGroupingDelayed */.s8)(300));
        }
        // 优化DOM观察器 - 使用防抖机制
        let restoreTimeout = null;
        const observer = new MutationObserver(mutations => {
            let shouldRestore = false;
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    const target = mutation.target;
                    // 检查是否是预设管理器的条目变化
                    if (target.classList?.contains('completion_prompt_manager') ||
                        target.querySelector?.('.completion_prompt_manager_prompt')) {
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
                    (0,src_/* restoreGroupingDelayed */.s8)(500);
                }, 200);
            }
        });
        // 开始观察预设管理器区域的变化
        const presetManagerContainer = $('.completion_prompt_manager').get(0);
        if (presetManagerContainer) {
            observer.observe(presetManagerContainer, {
                childList: true,
                subtree: true,
            });
            console.log('✅ 预设管理器DOM观察器已启动');
        }
        // 延迟恢复分组，避免阻塞UI加载
        setTimeout(() => {
            console.log('🔄 脚本加载完成，开始强制恢复分组配置...');
            (0,src_/* forceRestoreGrouping */.nO)();
        }, 2000);
        console.log('✅ 非关键功能初始化完成');
    }
    catch (error) {
        console.error('初始化非关键功能失败:', error);
    }
}
// 在加载脚本时执行初始化
console.log('🔥 喵喵预设配置管理模块开始加载...');
$(() => init());
// 在卸载脚本时执行清理
$(window).on('pagehide', () => {
    // 清理全局标记
    const win = window;
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
            const { clearAllGrouping } = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 11));
            clearAllGrouping();
        }
        catch (error) {
            // 忽略清理错误
        }
    }, 0);
    console.log('✅ 喵喵预设配置管理已卸载');
});

// EXTERNAL MODULE: ./src/喵喵预设配置管理/导入导出功能.ts + 1 modules
var src_3 = __webpack_require__(510);
;// ./src/喵喵预设配置管理/index.ts













