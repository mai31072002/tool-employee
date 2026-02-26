import React, { useMemo } from "react";
import { message, Tag } from "antd";

    export const notificationPopup = (status, text) => {
        if (status === 200) {
            message.success(`${status} - ${text}`).then();
        } else {
            message.error(`${status} - ${text}`).then();
        }
    };
