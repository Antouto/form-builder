import { useEffect, useState } from "react"

export function useScreenWidth(size: number) {
    const [width, setWidth] = useState(0)

    useEffect(() => {
        function handleResize() {
            setWidth(window.innerWidth)
        }

        window.addEventListener("resize", handleResize)

        handleResize()

        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [setWidth])

    return width > size
}

export function useScreenHeightNumber() {
    const [height, setHeight] = useState(0)

    useEffect(() => {
        function handleResize() {
            setHeight(window.innerHeight)
        }

        window.addEventListener("resize", handleResize)

        handleResize()

        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [setHeight])

    return height
}