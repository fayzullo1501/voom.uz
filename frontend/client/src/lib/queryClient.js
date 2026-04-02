import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Показывает кеш мгновенно, тихо обновляет в фоне
      staleTime: 60 * 1000,        // 1 мин — данные считаются свежими
      gcTime: 5 * 60 * 1000,       // 5 мин — кеш хранится в памяти
      retry: 1,                     // 1 повтор при ошибке
      refetchOnWindowFocus: false,  // не рефетчить при переключении вкладки браузера
    },
  },
});

export default queryClient;
