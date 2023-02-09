export const unreadNotificationsFunc = (notifications) => {
    return notifications.filter((ntf) => ntf.isRead === false);
};
