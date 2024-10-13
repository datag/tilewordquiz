
export const Settings = (() => {
    const SETTINGS_KEY = 'appSettings';

    const defaultSettings = {
        useAi: false,
        openAiApiKey: null,
        language: 'de',
        topic: null,
        temperature: 1.0,
    };

    const loadSettings = () => {
        const storedSettings = localStorage.getItem(SETTINGS_KEY);
        return storedSettings ? { ...defaultSettings, ...JSON.parse(storedSettings)} : { ...defaultSettings };
    };

    const saveSettings = (newSettings) => {
        const currentSettings = loadSettings();
        const updatedSettings = { ...currentSettings, ...newSettings };
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(updatedSettings));
    };

    const resetSettings = () => {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(defaultSettings));
    };

    const removeSetting = (key) => {
        const currentSettings = loadSettings();
        if (currentSettings[key] !== undefined) {
            delete currentSettings[key];
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(currentSettings));
        }
    };

    return {
        loadSettings,
        saveSettings,
        resetSettings,
        removeSetting,
    };
})();
