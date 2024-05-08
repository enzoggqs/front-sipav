import React from 'react'
import {
  Input,
  InputLeftElement,
  InputGroup,
  InputRightElement,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { Field } from 'formik';
import "./customInput.css";

const CustomInput = ({ icon, label, type, show, handleClick, touched, errors, ...props }) => {
  const today = new Date().toISOString().slice(0, 10);

  return (
    <Field name={props.name}>
      {({ field, form }) => (
        <FormControl
          isInvalid={form.errors[field.name] && form.touched[field.name]}
          pb="4"
        >
          <FormLabel
            fontSize="md"
            color="primary.600"
            mt=".5rem"
            fontWeight="medium"
          >
            {label}
          </FormLabel>
          <InputGroup>
            <InputLeftElement ml=".5rem" h="full" pointerEvents="none">
              {icon}
            </InputLeftElement>
            <Input
              {...field}
              {...props}
              type={type === "password" ? (show ? "text" : "password") : type}
              max={type === 'date' ? today : undefined} // Handle non-date types gracefully
              height="2.5rem"
              value={field.value || ""} // Definir um valor padrão
            />
            {type === "password" && (
              <InputRightElement h="full" width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleClick}>
                  {show ? <ViewOffIcon /> : <ViewIcon />}
                </Button>
              </InputRightElement>
            )}
          </InputGroup>
          <FormErrorMessage>{form.errors[field.name]}</FormErrorMessage>
        </FormControl>
      )}
    </Field>
  )
}

export default CustomInput