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

const CustomInput = ({ icon, label, type, show, handleClick, touched, errors, ...props }) => {
  const today = new Date().toISOString().slice(0, 10);
  const applyVisualCPFFormat = (value) => {
    // Enhanced mask logic with optional separators and error handling
    if (props.name === "cpf") {
      const mask = "###.###.###-##"; // Standard CPF mask
      let formattedValue = "";

      if (value && !isNaN(value)) {
        // Ensure value is a valid number
        const numbers = value.toString().split('');
        let index = 0;

        for (let i = 0; i < mask.length; i++) {
          if (mask[i] !== '#') {
            formattedValue += mask[i];
          } else if (numbers[index]) {
            formattedValue += numbers[index];
            index++;
          }
        }
      }

      return formattedValue;
    }
    return value;
  };

  const getType = () => {
    if (type === "password") {
      return show ? "text" : "password";
    }
    return type;
  };

  return (
    <Field name={props.name}>
      {({ field, form }) => (
        <FormControl
          isInvalid={form.errors[field.name] && form.touched[field.name]}
          pb="4"
        >
          <FormLabel
            fontSize={["sm", "md", "md", "md"]}
            color="primary.600"
            mt={[".1rem", ".4rem", ".5rem", ".5rem"]}
            fontWeight="medium"
          >
            {label}
          </FormLabel>
          <InputGroup>
            <InputLeftElement ml=".5rem" h="full" pointerEvents="none">
              {icon}
            </InputLeftElement>
            <Input
              autoComplete="on"
              {...field}
              {...props}
              type={getType()}
              max={type === 'date' ? today : undefined} // Handle non-date types gracefully
              height="2.5rem"
              fontSize={["sm", "md", "md", "md"]}
              value={props.name == "cpf" ? applyVisualCPFFormat(field.value) : (field.value || "")}
              onChange={(e) => {
                const unformattedValue = e.target.value.replace(/\D/g, '')
                props.name == "cpf" ? ( // Remove non-digits
                form.setFieldValue(field.name, unformattedValue)) : (
                form.setFieldValue(field.name, e.target.value)); // Atualizar o valor do campo no Formik
                props.onChange && props.onChange(e);
              }}
            />
            {type === "password" && (
              <InputRightElement h="full" width={["4.5rem", "4.5rem", "4.5rem", "4.5rem"]}>
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