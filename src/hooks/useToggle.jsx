import { useState } from "react"

const useToggle = (initialState) => {
    const [toggleValue, setToggleValue] = useState(initialState)
    const toggler = () => {
        setToggleValue((prev) => !prev)
    }
    return [toggleValue, toggler]
}
export default useToggle