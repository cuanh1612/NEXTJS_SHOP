import { AlertStatus, useToast } from '@chakra-ui/react'

export const UseToast = () => {
    //Config inform
    const toast = useToast()

    const showToast = (title: String, description: String, status: AlertStatus) => {
        return toast({
            title: title,
            description: description,
            status: status,
            duration: 5000,
            isClosable: true,
            position: "top-right"
        })
    }

    return {
        showToast
    }
}