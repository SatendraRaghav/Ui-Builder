import createCache from "@emotion/cache"
import { CacheProvider, Global } from "@emotion/react"
import { useEffect } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { HelmetProvider } from "react-helmet-async"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import store from "./store"
import { RouterProvider } from "react-router-dom"
import {
  ConfigProvider,
  MessageGroup,
  ModalGroup,
  NotificationGroup,
} from "@illa-design/react"
import "@/api/base"
import { illaCodeMirrorTooltipStyle } from "@/components/CodeEditor/CodeMirror/theme"
import { GlobalDataProvider } from "@/page/App/context/globalDataProvider"
import { getIsILLAProductMode } from "@/redux/config/configSelector"
import {
  getCurrentConfigLanguage,
  getCurrentTranslateLanguage,
} from "@/redux/currentUser/currentUserSelector"
import { ILLARoute } from "@/router"
import { px2Rem } from "@/utils/stylis-plugin/px2rem"
import { globalStyle } from "./style"
import Editor from "./page/App"

function App() {
  const configLanguage = useSelector(getCurrentConfigLanguage)
  const currentUserLanguage = useSelector(getCurrentTranslateLanguage)
  const { i18n } = useTranslation()
  const isProductMode = useSelector(getIsILLAProductMode)

  useEffect(() => {
    if (!currentUserLanguage) {
      i18n.changeLanguage(currentUserLanguage)
    }
  }, [currentUserLanguage, i18n])

  let cache = createCache({
    key: "css",
    stylisPlugins: [
      px2Rem({
        unit: "rem",
        remSize: 100,
      }),
    ],
  })
  const socket = new WebSocket("ws://localhost:3200");
  // socket.OPEN
  socket.onopen = (event)=>console.log("You are connected with WS");
  console.log(socket.readyState)
  socket.onmessage = (event)=>console.log(`from Backend : ${event.data}`);
  // socket.send('satendra raghav')
  socket.onopen = (event) => {
    // socket.send(JSON.stringify(store.getState().currentApp.editor.components));
    socket.send("message from client: You are welcome");
  };
  socket.onclose = (event) => {
    socket.send("We are closing this server");
    socket.send(event.reason)
  };
  return (
    <>
    {/* // <div style={{textAlign:"center",padding:"30px"}}>Act21</div> */}
    
    <CacheProvider value={cache}>
      <HelmetProvider>
        <DndProvider backend={HTML5Backend}>
          <GlobalDataProvider>
            <ConfigProvider locale={configLanguage}>
              <Global styles={globalStyle} />
              <MessageGroup pt={!isProductMode ? "46px" : "0"} />
              <NotificationGroup pt={!isProductMode ? "46px" : "0"} />
              <ModalGroup />
              {/* <RouterProvider router={ILLARoute} />
              <div
                className="illaCodeMirrorWrapper"
                css={illaCodeMirrorTooltipStyle}
              /> */}
              <Editor />
            </ConfigProvider>
          </GlobalDataProvider>
        </DndProvider>
      </HelmetProvider>
    </CacheProvider>
    </>
  )
}

export default App
