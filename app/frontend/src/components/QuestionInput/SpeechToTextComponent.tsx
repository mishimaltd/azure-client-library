import React, { useState, useEffect, useRef } from "react";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { Mic20Filled, Mic48Filled, MicPulseOff48Filled, MicOff24Filled } from "@fluentui/react-icons";
import styles from "./QuestionInput.module.css";

const SPEECH_KEY = "d76ec0e0b48f425ba870d567a33c22ff";
const SPEECH_REGION = "eastus";

interface Props {
    onSpeech: (speech: string) => void;
    onTranscript: (transcript: string) => void;
}

var recognizer = null;


export const SpeechToTextComponent = ({ onSpeech, onTranscript }: Props) => {

    let speechConfig = null;
    let audioConfig = null;
    const [isListening, setIsListening] = useState(false);

    const processRecognizedTranscript = event => {
        const result = event.result;
        console.log("Recognition result:", result);

        if (result.reason === sdk.ResultReason.RecognizedSpeech) {
            const transcript = result.text;
            console.log("Transcript: -->", transcript);
            onSpeech(transcript);
            stopListening();
        }
    };

    const processRecognizingTranscript = event => {
        const result = event.result;
        console.log("Recognition result:", result);
        if (result.reason === sdk.ResultReason.RecognizingSpeech) {
            const transcript = result.text;
            console.log("Transcript: -->", transcript);
            onTranscript(transcript);
        }
    };

    const startListening = () => {

        speechConfig = sdk.SpeechConfig.fromSubscription(SPEECH_KEY, SPEECH_REGION);
        speechConfig.speechRecognitionLanguage = "en-US";
    
        audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
        recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
    
        recognizer.recognized = (s, e) => processRecognizedTranscript(e);
        recognizer.recognizing = (s, e) => processRecognizingTranscript(e);
    
        recognizer.startContinuousRecognitionAsync(
            () => {
                console.log("Started listening...");
                setIsListening(true);
            },
            (err: string) => {
                console.log(`Error on start listening: ${err}`);
            }
        );
    };

    const stopListening = () => {
        console.log('recognizer: ' + recognizer);
        recognizer.stopContinuousRecognitionAsync(
            () => {
                console.log("Stopped listening.");
                recognizer = null;
                setIsListening(false);
            },
            (err: string) => {
                console.log(`Error on stop listening: ${err}`);
                recognizer = null;
                setIsListening(false);
            }
        );
    };

    return (
        <div className={styles.questionInputButtonsContainer}>
            <div className={`${styles.recordingButton} ${isListening ? styles.recordingButtonHidden : ""}`} 
                aria-label="Record" 
                onClick={startListening}>
                <Mic48Filled primaryFill="rgba(115, 118, 225, 1)" />
            </div>
            <div className={`${styles.recordingButton} ${!isListening ? styles.recordingButtonHidden : ""}`} 
                aria-label="Record" 
                onClick={stopListening}>
                <MicPulseOff48Filled primaryFill="rgba(115, 118, 225, 1)" />
            </div>
        </div>
    );
};
