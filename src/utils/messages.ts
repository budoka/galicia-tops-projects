import { message } from 'antd';
import React from 'react';

const MESSAGE_KEY = 'MESSAGE';

function loading(content: React.ReactNode) {
  message.loading({ key: MESSAGE_KEY, content, duration: 0 });
}

function success(content: React.ReactNode, duration: number = 3) {
  message.success({ key: MESSAGE_KEY, content, duration });
}

function error(content: React.ReactNode, duration: number = 3) {
  message.error({ key: MESSAGE_KEY, content, duration });
}

function info(content: React.ReactNode, duration: number = 3) {
  message.info({ key: MESSAGE_KEY, content, duration });
}

function warning(content: React.ReactNode, duration: number = 3) {
  message.warning({ key: MESSAGE_KEY, content, duration });
}

const Message = {
  loading,
  success,
  error,
  info,
  warning,
};

export { Message };
