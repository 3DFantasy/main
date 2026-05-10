/**
 * Compatibility wrapper preserving the HeroUI v2 Input API
 * (single component with `label`, `errorMessage`, `endContent`, `color`,
 * event-shaped `onChange`) on top of HeroUI v3's compound TextField.
 * Lets routes keep their existing call sites without restructuring.
 */
import {
    FieldError,
    InputGroup,
    Input as InputRoot,
    Label,
    TextField,
} from '@heroui/react'

import type { ChangeEvent, ReactNode } from 'react'

type V2Color = 'default' | 'danger' | 'success' | 'warning'

export interface InputProps {
    label?: string
    name?: string
    type?: string
    value?: string
    placeholder?: string
    color?: V2Color
    isDisabled?: boolean
    errorMessage?: string
    className?: string
    endContent?: ReactNode
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void
}

export function Input({
    label,
    name,
    type,
    value,
    placeholder,
    color,
    isDisabled,
    errorMessage,
    className,
    endContent,
    onChange,
}: InputProps) {
    return (
        <TextField
            name={name}
            type={type}
            value={value}
            isDisabled={isDisabled}
            isInvalid={color === 'danger'}
            className={className}
            onChange={
                onChange
                    ? (next: string) =>
                          onChange({
                              target: { value: next },
                          } as ChangeEvent<HTMLInputElement>)
                    : undefined
            }
        >
            {label ? <Label>{label}</Label> : null}
            {endContent ? (
                <InputGroup>
                    <InputGroup.Input placeholder={placeholder} />
                    <InputGroup.Suffix>{endContent}</InputGroup.Suffix>
                </InputGroup>
            ) : (
                <InputRoot placeholder={placeholder} />
            )}
            {errorMessage ? <FieldError>{errorMessage}</FieldError> : null}
        </TextField>
    )
}
