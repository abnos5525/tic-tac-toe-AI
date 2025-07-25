import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { routers } from "./routers/index.tsx";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider } from "antd";
import fa_IR from "antd/lib/locale/fa_IR";
import CustomTheme from "../antd.theme";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24,
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={CustomTheme} locale={{ ...fa_IR }} direction="rtl">
        <RouterProvider router={routers} />
      </ConfigProvider>
    </QueryClientProvider>
  </StrictMode>
);
