import { Outlet } from "react-router-dom";
import { App, notification } from "antd";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Template = () => {
  const navigate = useNavigate();

  notification.config({
    placement: "topRight",
    bottom: 50,
    duration: 3,
    rtl: true,
  });

  return (
    <App>
      <Outlet />
    </App>
  );
};

export default Template;
