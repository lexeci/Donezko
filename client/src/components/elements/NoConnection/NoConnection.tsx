import {WifiX} from "@phosphor-icons/react/dist/ssr";

export default function NoConnection() {
    return (
        <div
            className="no-connection relative w-full h-[calc(100vh-82px)] flex flex-col justify-center items-center gap-y-4">
            <div className="icon animate-gentle-shake">
                <WifiX size={80} color="text-foreground"/>
            </div>
            <div className="title text-2xl font-bold">
                <h3>Sorry, no internet connection...</h3>
            </div>
            <div className="text-block">
                <p>Looks like your digital highway has a traffic jam. Check your connection and try again!</p>
            </div>
        </div>
    )
}