export function saveSearchHistoryInLocalStorage(newSearch: string): void  {
    const localStorageKey= import.meta.env.VITE_LocalStorage_Search_History_Name;
        if (!newSearch.trim()) return;
    
        const MAX_ITEMS = 9;
    
        try {
          const existingData = localStorage.getItem(localStorageKey);
          let history: string[] = existingData ? JSON.parse(existingData) : [];
    
          history = history.filter(
            (item) => item.toLowerCase() !== newSearch.toLowerCase(),
          );
    
          history.unshift(newSearch);
    
          if (history.length > MAX_ITEMS) {
            history = history.slice(0, MAX_ITEMS);
          }
    
          localStorage.setItem(localStorageKey, JSON.stringify(history));
        } catch (error) {
          console.error("Failed to save search history to localStorage:", error);
        }
      };

