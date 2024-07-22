import { useState } from 'react';

function ResultDisplay(props) {
    const { result, scanid } = props;

    if (result === 0) {
        return (
            <>
                <span className='text-2xl text-green-800 bg-green-400 p-4 border-solid border-green-900 border-2 rounded-2xl hover:bg-green-600 hover:text-[#1F1F1F] transition-all'>
                    NOT MALICIOUS
                </span>
                <div className='pt-16 text-lg font-semibold'>
                    Scan ID: {scanid}
                </div>
            </>
        );
    } else if (result === 1) {
        return (
            <>
                <span className='text-black p-4 border-2 rounded-2xl border-solid text-2xl bg-[#fffc59] hover:bg-[#FFFF33] transition-all hover:text-[#1F1F1F]'>
                    MAYBE MALICIOUS
                </span>
                <div className='pt-16 text-lg font-semibold'>
                    Scan ID: {scanid}
                </div>
            </>
        );
    } else if (result === 2) {
        return (
            <>
                <span className='text-red-200 p-4 border-2 rounded-2xl border-solid text-2xl bg-[#D62929] hover:text-white hover:bg-[#CA1F1D] transition-all border-red-400'>
                    MALICIOUS
                </span>
                <div className='pt-16 text-lg font-semibold'>
                    Scan ID: {scanid}
                </div>
            </>
        );
    } else if (result === 3) {
        return (
            <span className='text-[#1F1F1F] hover:text-orange-300 transition-all bg-orange-400 hover:bg-orange-600 p-4 border-2 rounded-2xl border-solid text-2xl m-8'>
                URL NOT FOUND
            </span>
        );
    } else {
        return null;
    }
}

function DetailsDisplay(props) {
    const {
        permalink,
        positives,
        resource,
        response_code,
        scan_date,
        scan_id,
        total,
        url,
        scans
    } = props.report;

    return (
        <>
            <br />
            <br />
            <a href={permalink} target="_blank" rel="noopener noreferrer" className='hover:text-blue-500 transition-all'>
                Permalink: {permalink}
            </a>
            <p className='p-1'>Positives: {positives}</p>
            <p className='p-1'>Resource: {resource}</p>
            <p className='p-1'>Response Code: {response_code}</p>
            <p className='p-1'>Scan Date: {scan_date}</p>
            <p className='p-1'>Scan ID: {scan_id}</p>
            <p className='p-1'>Total: {total}</p>
            <a href={url} target="_blank" rel="noopener noreferrer" className='hover:text-blue-500 transition-all'>
                URL: {url}
            </a>
            <h3 className='text-3xl pt-5'>Scans</h3>
            {Object.entries(scans).map(([scanner, result], index) => (
                <div key={index} className='flex flex-row flex-wrap bg-slate-700 p-1'>
                    <h4 className='basis-1/4 text-right'>{scanner}:</h4>
                    <p className='basis-1/4 mx-16'>
                        {result.detected ? (
                            <span className='bg-red-500 px-16'>Detected</span>
                        ) : (
                            <span className='bg-green-400 text-black px-16'>Not Detected</span>
                        )}
                    </p>
                    <p className='basis-1/4'>
                        {result.detected ? (
                            <span className='bg-red-500 px-16'>Result: {result.result}</span>
                        ) : (
                            <span className='bg-green-400 text-black px-16'>Result: {result.result}</span>
                        )}
                    </p>
                    {/* {result.detail && <p className='basis-1/4'>Detail: <a href={result.detail}>{result.detail}</a></p>} */}
                </div>
            ))}
        </>
    );
}

function Inputs() {
    const [result, setResult] = useState(false);
    const [initi, setIniti] = useState(null);
    const [url, setUrl] = useState('');
    const [apikeycode, setAPI] = useState('');
    const [scanid, setID] = useState('');
    const [repdis, setRepdis] = useState(false)
    const [showMoreClick, setShowMoreClick] = useState(false);
    const [report, setReport] = useState('');
    const [repstat, setRepstat] = useState(false);

    const checkMal = async () => {
        if (url === '') {
            setRepstat(false);
            setResult(null);
            return;
        } else if (!url.startsWith('https://') && !url.startsWith('http://')) {
            setRepstat(false);
            setResult(null);
            setIniti(true);
            setRepdis(false)
            alert("Enter a valid URL");
            return;
        }
        const res = await fetch("https://url-scanner-2.onrender.com/scan-url", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "url": url,
                "api": apikeycode
            })
        });
        const data = await res.json();
        const resMess = data.resultMessage;
        const scanidlat = data.scan_id;
        setResult(resMess);
        setID(scanidlat);
        if (data.resultMessage !== 3) {
            setRepstat(true);
        }
        setReport(data);
        setIniti(true);
        setRepdis(true)
    };

    const handleShowMoreClick = () => {
        setShowMoreClick(!showMoreClick);
    };

    return (
        <div className='text-center bg-[#181818] p-16 text-gray-200 font-mono'>
            <p className='text-left font-bold text-2xl'>NCPC</p>
            {/* <input type="text" value={apikeycode} onChange={(e) => setAPI(e.target.value)} placeholder='Enter API Key' className='rounded-lg m-12 p-4 border border-black bg-[#292a2c] hover:border-white transition-all' /> */}
            <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder='Enter URL'
                className='rounded-lg m-12 p-4 border border-black bg-[#292a2c] hover:border-white transition-all'
            />
            <button
                onClick={checkMal}
                className='p-4 m-12 rounded-2xl bg-[#9BE0E7] text-xl text-[#1F1F1F] font-bold hover:bg-[#6AD0DC] transition-all hover:text-[#1F1F1F]'
            >
                SUBMIT
            </button>
            <br />
            {repdis && <ResultDisplay result={result} scanid={scanid} />}
            <br />
            {repstat ? (
                <button
                    className='bg-zinc-600 text-gray-100 px-4 py-2 border-2 rounded-xl animate-bounce hover:bg-zinc-800 transition-all hover:text-white'
                    onClick={handleShowMoreClick}
                >
                    Show {showMoreClick ? 'Less ∧' : 'More ∨'}
                </button>
            ) : (
                <p className='text-yellow-400'>
                    {initi ? 'INVALID URL: Please enter a valid URL starting with http:// or https://' : ''}
                </p>
            )}
            {showMoreClick && <DetailsDisplay report={report} result={result} />}
        </div>
    );
}

export default Inputs;
