import { Form, Select } from 'antd';
import { useId } from 'react';
import { useController, type FieldValues, type UseControllerProps } from 'react-hook-form';

type Option = { value: string; label: string };

type SelectFieldProps<TValues extends FieldValues, TOutput> = UseControllerProps<
  TValues,
  UseControllerProps<TValues>['name'],
  TOutput
> & {
  label: string;
  options: readonly Option[];
  placeholder?: string;
  disabled?: boolean;
  showSearch?: boolean;
};

/** A labeled Ant Design select bound to react-hook-form, with the field's error under it. */
const SelectField = <TValues extends FieldValues, TOutput>({
  label,
  options,
  placeholder,
  disabled,
  showSearch,
  ...controllerProps
}: SelectFieldProps<TValues, TOutput>) => {
  const id = useId();
  const {
    field: { value, ...field },
    fieldState,
  } = useController(controllerProps);

  return (
    <Form.Item
      label={label}
      htmlFor={id}
      validateStatus={fieldState.error ? 'error' : undefined}
      help={fieldState.error?.message}
    >
      <Select
        {...field}
        id={id}
        // An empty string would show as a selected blank option instead of the placeholder.
        value={value || undefined}
        options={options.map(({ value, label: optionLabel }) => ({ value, label: optionLabel }))}
        placeholder={placeholder}
        disabled={disabled}
        showSearch={showSearch ? { optionFilterProp: 'label' } : false}
        size="large"
        // Short lists (UFs, offers): render every option, also for screen readers.
        virtual={false}
      />
    </Form.Item>
  );
};

export default SelectField;
