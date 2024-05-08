import { Flex } from '@chakra-ui/react'
import { Formik } from 'formik'
import React from 'react'

const CustomForm = ({children, initialValues, validationSchema, submitFunction}) => {
  return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={submitFunction()}
        >
            {({ handleSubmit, errors, touched, isValid, dirty }) => (
            <Flex
                as={Form}
                backgroundColor="#F0F1F3"
                width="36%"
                pt={"2rem"}
                borderRadius="30px"
                flexDirection="column"
                alignItems="center"
                boxShadow="dark-lg"
                onSubmit={handleSubmit}
            >
                {React.Children.map(children, child => {
                    return React.cloneElement(child, { formikProps });
                })}
            </Flex>
        )}
        </Formik>
    )
}

export default CustomForm