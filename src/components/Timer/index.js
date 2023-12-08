import React from "react"
import CountDown from "react-native-countdown-component"

const Timer = ({ until, running, onFinish }) => {
  return (
    <CountDown
      until={until}
      size={15}
      digitStyle={{
        margin: 0,
        padding: 0,
        height: 20
      }}
      digitTxtStyle={{ fontWeight: "bold", color: "black", fontSize: 15 }}
      timeToShow={["M", "S"]}
      timeLabels={{ m: null, s: null }}
      running={{ running }}
      showSeparator
      onFinish={onFinish}
    />
  )
}

export default Timer
