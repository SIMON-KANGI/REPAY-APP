import { ChakraProvider } from "@chakra-ui/react"
import appTheme from "./theme"

function Chakra({children}){
    return <ChakraProvider theme={appTheme}>{children}</ChakraProvider>

}
export default Chakra