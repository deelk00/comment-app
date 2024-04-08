import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useAuthorName } from "../../hooks/use-author-name";

export const Settings: React.FC = () => {
    const [isLatencyDirty, setIsLatencyDirty] = useState(false);
    const {authorName, setAuthorName} = useAuthorName();
    const [requestLatency, setRequestLatency] = useState<number | undefined>(0);
    
    useEffect(() => {
        fetch('http://localhost:5000/settings/latency')
            .then(response => response.json())
            .then(data => {
            setRequestLatency(data.delay);
            }).catch(error => console.error(error));
    }, []);

    const handleAuthorNameChange = (event: React.ChangeEvent<HTMLInputElement>) => { 
        const value = event.target.value;
        setAuthorName(value);
        setIsLatencyDirty(true);
      }
    
    const handleLatencyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value !== "" ? Number(event.target.value) : undefined;
        if (value && (isNaN(value) || value < 0)) {
            return;
        }
        setIsLatencyDirty(true);
        setRequestLatency(value);
    }

    const updateLatency = () => {
        const settings = { delay: requestLatency };
        fetch('http://localhost:5000/settings/latency', {
          method: 'PATCH',
          body: JSON.stringify(settings),
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(() => setIsLatencyDirty(false));
    }

    return (
        
        <div className='settings keep row'>
          <FontAwesomeIcon 
            className='settings-icon keep' 
            size='lg'
            icon={"cog"} 
            />
          <div className='column'>
            <div className='control'>
              <FontAwesomeIcon 
                className='keep icon' 
                size='lg'
                icon={"person"} 
                />
              <input type="text" placeholder='Anonymous' onChange={handleAuthorNameChange} value={authorName}></input>
            </div>
            <div className='control'>
              <FontAwesomeIcon 
                className='keep icon' 
                size='lg'
                icon={"clock"} 
                />
              <input type={"number"} min={0} value={requestLatency === undefined ? "" : requestLatency} onChange={handleLatencyChange}></input>
              <span className='unit'>ms</span>
            </div>
            <div className='row keep'>
              <button className='save-button keep' disabled={!isLatencyDirty} onClick={updateLatency}>Speichern</button>
            </div>
          </div>
        </div>
    )
}