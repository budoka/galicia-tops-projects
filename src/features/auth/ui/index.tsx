import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, ButtonProps, CheckboxProps, Form, FormItemProps as AntFormItemProps, FormProps, Input, Radio, RadioGroupProps, Tabs } from 'antd';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import { useForm } from 'antd/lib/form/Form';
import { InputProps } from 'antd/lib/input/Input';
import React, { Key } from 'react';
import { useHistory } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'src/app/store/store.hooks';
import { Wrapper } from 'src/components/wrapper';
import { Texts } from 'src/constants/texts';
import { getRule } from 'src/features/_shared/ui/utils';
import { Message } from 'src/helpers/message.helper';
import { Rules } from 'src/types';
import { LoginDto, RegisterDto } from '../data/dto';
import { login, register } from '../logic';
import styles from './style.module.less';

const { TabPane } = Tabs;

export type FormItemProps = AntFormItemProps & { key: Key };

export interface FormComponents {
  input: (formProps: FormItemProps, inputProps: InputProps) => JSX.Element;
  checkbox: (formProps: FormItemProps, checkboxProps: CheckboxProps) => JSX.Element;
  radioGroup: (formProps: FormItemProps, radioGroupProps: RadioGroupProps) => JSX.Element;
  button: (formProps: FormItemProps, buttonProps: ButtonProps) => JSX.Element;
}

export interface AuthFormProps {
  key: Key;
  title: string | JSX.Element;
  formProps: FormProps;
  fields: {
    formItemProps: FormItemProps;
    inputProps?: InputProps;
    checkboxProps?: CheckboxProps;
    radioGroupProps?: RadioGroupProps;
    buttonProps?: ButtonProps;
  }[];
}

const rules: Rules = {
  username: [
    {
      required: true,
      message: 'Invalid username!',
    },
  ],
  password: [
    {
      required: true,
      message: 'Invalid password!',
    },
  ],
  role: [
    {
      required: true,
      message: 'Invalid role!',
    },
  ],
};

export const Login: React.FC = (props) => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((s) => s.auth);
  const history = useHistory();

  const forms = {
    login: useForm<LoginDto>()[0],
    register: useForm<RegisterDto>()[0],
  };

  //#region Data

  const loginForm: AuthFormProps = {
    key: 'login',
    title: 'Login',
    formProps: {
      form: forms.login,
      className: styles.form,
      onFinish: (values) => {
        loginUser(values);
      },
      onFinishFailed: (errorInfo) => {},
    } as FormProps<LoginDto>,
    fields: [
      {
        formItemProps: { key: 'username', name: 'username', rules: getRule(rules, 'username'), className: styles.formItem },
        inputProps: { prefix: <UserOutlined />, placeholder: 'Username', type: 'text', className: styles.input },
      },
      {
        formItemProps: { key: 'password', name: 'password', rules: getRule(rules, 'password'), className: styles.formItem },
        inputProps: { prefix: <LockOutlined />, placeholder: 'Password', type: 'password', className: styles.input },
      },
      {
        formItemProps: { key: 'submit', className: styles.formItem },
        buttonProps: { title: 'Login', type: 'primary', htmlType: 'submit', loading: auth.data.login?.loading, className: styles.button },
      },
    ],
  };

  const registerForm: AuthFormProps = {
    key: 'register',
    title: 'Register',
    formProps: {
      className: styles.form,
      onFinish: (values) => {
        console.log('Form finish!');
        registerUser(values);
      },
      onFinishFailed: (errorInfo) => {
        console.log('Form fail!');
      },
    } as FormProps<RegisterDto>,
    fields: [
      {
        formItemProps: { key: 'username', name: 'username', rules: getRule(rules, 'username'), className: styles.formItem },
        inputProps: { prefix: <UserOutlined />, placeholder: 'Username', type: 'text', className: styles.input },
      },
      {
        formItemProps: { key: 'password', name: 'password', rules: getRule(rules, 'password'), className: styles.formItem },
        inputProps: { prefix: <LockOutlined />, placeholder: 'Password', type: 'password', className: styles.input },
      },
      {
        formItemProps: { key: 'repeatedPassword', name: 'repeatedPassword', rules: getRule(rules, 'password'), className: styles.formItem },
        inputProps: { prefix: <LockOutlined />, placeholder: 'Repeat Password', type: 'password', className: styles.input },
      },
      {
        formItemProps: { key: 'role', name: 'role', rules: getRule(rules, 'role'), className: styles.formItem },
        radioGroupProps: {
          className: styles.radioGroup,
          options: [
            { label: 'Admin', value: 'admin' },
            { label: 'User', value: 'user' },
          ],
        },
      },
      {
        formItemProps: { key: 'submit', className: styles.formItem },
        buttonProps: { title: 'Register', type: 'primary', htmlType: 'submit', loading: auth.data.register?.loading, className: styles.button },
      },
    ],
  };

  //#endregion

  //#region Functions

  const loginUser = async (body: LoginDto) => {
    const result = await dispatch(login({ body }));

    if (login.fulfilled.match(result)) {
      history.push('home');
      Message.success(Texts.LOGIN_SUCCESS);
    } else if (result.payload?.status! > 500) Message.error(Texts.SERVER_UNAVAILABLE);
    else Message.error(Texts.LOGIN_FAILED);
  };

  const registerUser = async (body: RegisterDto) => {
    const result = await dispatch(register({ body }));

    if (register.fulfilled.match(result)) {
      history.push('home');
      Message.success(Texts.LOGIN_SUCCESS);
    } else if (result.payload?.status! > 500) Message.error(Texts.SERVER_UNAVAILABLE);
    else Message.error(Texts.REGISTER_FAILED);
  };

  //#endregion

  //#region Renders

  const renderAuthPanels = (forms: AuthFormProps[]) => {
    return (
      <Tabs className={styles.tabs} defaultActiveKey={'login'} centered>
        {forms.map((form) => {
          const { title } = form || {};
          return (
            <TabPane key={form.key} tab={title}>
              {renderForm(form)}
            </TabPane>
          );
        })}
      </Tabs>
    );
  };

  const renderForm = (form: AuthFormProps) => {
    const components: FormComponents = {
      input: (formItemProps, inputProps) => {
        const { type } = inputProps;
        const component = type === 'text' ? <Input {...inputProps} /> : <Input.Password {...inputProps} />;

        return renderFormItem(formItemProps, component);
      },
      checkbox: (formItemProps, checkboxProps) => {
        const component = <Checkbox {...checkboxProps} />;

        return renderFormItem(formItemProps, component);
      },
      radioGroup: (formItemProps, radioGroupProps) => {
        const component = <Radio.Group {...radioGroupProps} />;

        return renderFormItem(formItemProps, component);
      },
      button: (formItemProps, buttonProps) => {
        const { title } = buttonProps;
        const component = <Button {...buttonProps}>{title}</Button>;

        return renderFormItem(formItemProps, component);
      },
    };

    const renderFormItem = (formItemProps: FormItemProps, component: JSX.Element) => {
      return <Form.Item {...formItemProps}>{component}</Form.Item>;
    };

    return (
      <Form {...form.formProps}>
        {form.fields.map((field) => {
          const componentsKey = Object.keys(components);

          const fieldKey = Object.keys(field)
            .map((k) => k.replace('Props', ''))
            .find((k) => componentsKey.includes(k))!;

          return (components as any)[`${fieldKey}`](field.formItemProps, (field as any)[`${fieldKey + 'Props'}`]);
        })}
      </Form>
    );
  };

  //#endregion

  return (
    <Wrapper contentWrapper unselectable direction="column" vertical="middle">
      {renderAuthPanels([loginForm, registerForm])}
    </Wrapper>
  );
};
