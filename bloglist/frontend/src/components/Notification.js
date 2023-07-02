import { useSelector } from "react-redux";

const Notification = () => {
  const notification = useSelector(state => state.notification);

  return notification &&
    <div className="error">
      {notification}
    </div>;
};

export default Notification;
