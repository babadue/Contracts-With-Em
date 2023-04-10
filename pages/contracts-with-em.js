import Head from 'next/head'
import { useState, useEffect } from 'react'  //useEffect -> trigger at page load
import Web3 from 'web3'
import ContractsWithEm from '../blockchain/eming'
import 'bulma/css/bulma.css'
import styles from '../styles/contractswithem.module.css'

const Contracts_With_Em = () => {

    const [address, setAddress] = useState(null)
    const [contractsWE, setContractsWE] = useState(null)
    const [error, setError] = useState('')
    const [web3, setWeb3] = useState(null)
    const [text_msg, setTextMsg] = useState('This is default message')
    const [texts6, setTexts6] = useState('')
    const [menuType, setMenuType] = useState('')
    const [balance, setBalance] = useState('')
    const [successMsg, setSuccessMsg] = useState('')

    var totalReward = 0
    var reward = 0
    const each = 0.001
    var texts4
    var level = 0
    var indexes = []
    var texts = []
    var disable = false
    var aaa = 1

    // useEffect shown upon page loaded
    useEffect(() => {
        console.log("useEffect")
        initial_display()
        if (contractsWE) my_lab()
        if (contractsWE) load_history()
        if (contractsWE) setOwnerMenuDisplay()

    }, [contractsWE, address])

    function initial_display() {
        document.getElementById("collectreward").style.display = "none"
        document.getElementById("deeds").style.display = "none"
        document.getElementById("msg_info").style.display = "block"
        document.getElementById("bottom_msg_more").style.display = "none"
        document.getElementById("bottom_deposit").style.display = "none"
        document.getElementById("msg_success").style.display = "none"
        document.getElementById("msg_processing").style.display = "none"
    }

    const my_lab = async () => {
        console.log("my_lab")
        const _texts = await contractsWE.methods.getTexts().call()
        texts4 = _texts
        // texts = _texts
        setTexts6(_texts)
        level = 0;
        const _owner = await contractsWE.methods.owner().call()
        console.log(`contractsWE _owner  :: ${_owner}`)
        const getOwner = await contractsWE.methods.getOwner().call()
        console.log(`contractsWE getOwner  :: ${getOwner}`)
        const sender = await contractsWE.methods.getSender().call()
        console.log(`contractsWE sender  :: ${sender}`)
        console.log(`contractsWE address  :: ${address}`)

        // display deeds
        for (let i = 0; i < texts4.length; i++) {
            let labelN = `label_msg${i}`
            document.getElementById(labelN).innerHTML = ` &nbsp;&nbsp; ${texts4[i]}`
        }

        document.getElementById("msg_info").style.display = "none"

    }

    const load_history = async () => {
        console.log(`load_history login address: ${address}`)
        try {
            const em = await contractsWE.methods.getDevl(address).call()
            console.log(`load_history em ${em}`)
            let devl = em[0]
            let aDate = em[1]
            let aLevel = em[2]
            let aReward = em[3] / 10 ** 18  //in wei
            document.getElementById("deeds").style.display = "block"
            if (aLevel != 0) {
                let dateString = new Date(aDate * 1000)
                console.log(`load_history devl: ${devl} aDate: ${aDate} aLevel: ${aLevel} aReward: ${aReward / 10 ** 18}`)
                console.log(`load_history aDate:  ${aDate}  date::  ${dateString}`)

                const levels = await contractsWE.methods.findIndexes2(aLevel).call()
                console.log(`load_history levels ${levels}`)
                populateCheckBoxes(levels)
                let text_msgX = `${aReward} eth`
                console.log(`retrieveRewardHandler text_msgX ${text_msgX} aReward: ${aReward}`)
                let msg = `Above were your last selected deeds.&nbsp;&nbsp;  Your total reward so far: &nbsp;&nbsp; ${text_msgX}`
                document.getElementById("label_total_reward").innerHTML = `${msg}`
                setCheckboxesDisplay(disable = true)
                console.log(`retrieveRewardHandler aaa: ${aaa}`)
                document.getElementById("bottom_msg_more").style.display = "block"
            }
            else {
                console.log(`retrieveRewardHandler else`)
                document.getElementById("deeds").style.display = "block"
                document.getElementById("collectreward").style.display = "block"
                setCheckboxesDisplay(disable = false)
                console.log(`retrieveRewardHandler aaa: ${aaa}`)
            }
        } catch (err) {
            setError(err.message)
            console.log(`load_history no history found error: ${error}`)
        }
    }

    const setOwnerMenuDisplay = async () => {
        setMenuType("Contract With Em Menu.")
        const isOwner = await contractsWE.methods.isOnwer(address).call()

        if (isOwner) {
            document.getElementById("bottom_deposit").style.display = "block"
            setMenuType("Contract With Em Owner Menu.")
            try {
                const balance = await contractsWE.methods.getBalance().call({
                    from: address
                })
                setBalance(balance / 10 ** 18)
                console.log(`setOwnerMenuDisplay getbalance balance: ${balance}`)

            } catch (err) {
                console.log(`setOwnerMenuDisplay getbalance error: ${err.message}`)
                setError(err.message)
            }
        }
    }

    const setCheckboxesDisplay = async () => {
        const _texts = await contractsWE.methods.getTexts().call()
        console.log(`contractsWE _texts ${_texts}`)
        console.log(`setInitialDisplay texts.length: ${_texts.length}`)

        for (let i = 0; i < _texts.length; i++) {
            let checkboxN = `checkbox${i}`
            document.getElementById(checkboxN).disabled = disable
        }
    }

    const checkboxOnChangeHandler = async event => {
        var i = event.target.value
        var box = event.target
        console.log(`updatePricingModelHandler radio button value :: ${i} ${box}`)

        if (box.checked) {
            console.log(`checkbox is checked`)
            reward += each
            level += 2 ** i
        }
        else {
            console.log(`checkbox is unchecked`)
            reward -= each
            level -= 2 ** i
        }

        console.log(`updatePricingModelHandler radio button value i :: ${i} reward: ${reward} level: ${level}`)

        let text_msgX = `Your reward: ${reward} eth`
        document.getElementById("label_msgX").innerHTML = ` &nbsp;&nbsp; ${text_msgX}`
    }

    const collectRewardHandler = async event => {
        if (level > 0) {
            if (address) {
                setCheckboxesDisplay(disable = true)
                document.getElementById("processing_label").innerHTML = "Processing your reward ..."
                document.getElementById("msg_processing").style.display = "block"
                document.getElementById("bottom_deposit").style.display = "none"
                document.getElementById("collectreward").style.display = "none"
                const _owner = await contractsWE.methods.owner().call()
                console.log(`contractsWE _owner  :: ${_owner}`)
                console.log(`collectRewardHandler you will receive ${reward} in your wallet shortly!  level: ${level} address: ${address}`)
                try {
                    const x = await contractsWE.methods.reward(web3.utils.toWei(reward.toString(), 'ether'), level, address).send({
                        from: address,
                    })
                    const em = await contractsWE.methods.getDevl(address).call()
                    console.log(`collectMoreDeedsHandler em ${em}`)
                    let aReward = em[3] / 10 ** 18  //in wei
                    console.log(`collectMoreDeedsHandler reward: ${aReward}`)
                    document.getElementById("bottom_msg_more").style.display = "block"
                    const isOwner = await contractsWE.methods.isOnwer(address).call()
                    if (isOwner) {
                        document.getElementById("bottom_deposit").style.display = "block"
                        const balance = await contractsWE.methods.getBalance().call({
                            from: address
                        })
                        setBalance(balance / 10 ** 18)
                    }

                    document.getElementById("msg_processing").style.display = "none"
                    console.log(`depositButtonHandler reward address : ${address}`)
                    let msg = `You got your reward in amount of ${reward} eth for your deeds! &nbsp; Your total reward so far: ${aReward}`
                    document.getElementById("label_total_reward").innerHTML = `${msg}`
                    level = 0
                    reward = 0
                } catch (err) {
                    console.log(`depositButtonHandler reward error: ${err.message}`)
                    setError(err.message)
                }
            }
        }
    }

    function populateCheckBoxes(levels) {
        console.log(`populateCheckBoxes levels ${levels}`)
        for (let i = 0; i < levels.length; i++) {
            let checkboxN = `checkbox${levels[i]}`
            console.log(`populateCheckBoxes checkboxN ${checkboxN}`)
            document.getElementById(checkboxN).checked = true
        }
    }

    const collectMoreDeedsHandler = async event => {
        let text_msgX = `Your reward: ${reward} eth`
        document.getElementById("label_msgX").innerHTML = ` &nbsp;&nbsp; ${text_msgX}`
        document.getElementById("collect_reward_button").disabled = false
        document.getElementById("msg_success").style.display = "none"
        console.log(`1 collectMoreDeedsHandler reward: ${reward}`)
        const _texts = await contractsWE.methods.getTexts().call()
        console.log(`2 collectMoreDeedsHandler reward: ${reward}`)
        console.log(`collectMoreDeedsHandler texts: ${_texts}`)
        for (let i = 0; i < _texts.length; i++) {
            let checkboxN = `checkbox${i}`
            console.log(`collectMoreDeedsHandler checkboxN ${checkboxN}`)
            document.getElementById(checkboxN).checked = false
        }
        console.log(`3 collectMoreDeedsHandler reward: ${reward}`)
        setCheckboxesDisplay(disable = false)
        console.log(`4 collectMoreDeedsHandler reward: ${reward}`)
        document.getElementById("bottom_msg_more").style.display = "none"
        console.log(`5 collectMoreDeedsHandler reward: ${reward}`)
        document.getElementById("collectreward").style.display = "block"
        console.log(`6 collectMoreDeedsHandler reward: ${reward}`)
        const em = await contractsWE.methods.getDevl(address).call()
        console.log(`collectMoreDeedsHandler em ${em}`)
        let aReward = em[3] / 10 ** 18  //in wei
        totalReward = aReward
        console.log(`collectMoreDeedsHandler reward: ${totalReward}`)
    }

    const depositButtonHandler = async event => {

        let w = document.getElementById("amount").value
        if (w == "return") {
            console.log(`depositButtonHandler return `)
            // to transfer all contract's balance to owner account
            try {
                const balance = await contractsWE.methods.sendBalanceToOwner().send({
                    from: address,
                })
                console.log(`depositButtonHandler reward address : ${address}`)
            } catch (err) {
                console.log(`depositButtonHandler reward error: ${err.message}`)
                setError(err.message)
            }
            // end of to transfer all contract's balance to owner account
        }
        else if (w == "ems") {
            console.log(`depositButtonHandler getting ems `)
            getEms()
        }
        else {
            console.log(`depositButtonHandler wei: ${w}`)
            document.getElementById("processing_label").innerHTML = "Processing your deposit ..."
            document.getElementById("msg_processing").style.display = "block"
            document.getElementById("bottom_deposit").style.display = "none"
            document.getElementById("collectreward").style.display = "none"
            document.getElementById("bottom_msg_more").style.display = "none"
            try {
                const _texts = await contractsWE.methods.deposit().send({
                    from: address,
                    value: web3.utils.toWei(w.toString(), 'ether')
                })
                console.log(`depositButtonHandler deposited`)
                const balance = await contractsWE.methods.getBalance().call({
                    from: address
                })
                setBalance(balance / 10 ** 18)
                document.getElementById("msg_processing").style.display = "none"
                setSuccessMsg(`${w} eth deposited!`)
                document.getElementById('amount').value = ''
                document.getElementById("bottom_deposit").style.display = "block"

                if (document.getElementById("checkbox0").disabled == true) {
                    document.getElementById("bottom_msg_more").style.display = "block"
                }
                else {
                    document.getElementById("collectreward").style.display = "block"
                }
            } catch (err) {
                console.log(`depositButtonHandler error: ${err.message}`)
                setError(`failed to make a deposited ${err.message}`)
            }
            // end of deposit
        }



    }

    const getEms = async () => {
        // get ems
        try {
            const ems = await contractsWE.methods.getEms().call()
            console.log(`getEms ems length: ${ems.length}`)
            console.log(`getEms ems: ${ems}`)
            for (let i = 0; i < ems.length; i++) {
                console.log(`getEms ems_address: ${ems[i][0]}`)
                console.log(`getEms ems_date: ${new Date(ems[i][1] * 1000)}`)
                console.log(`getEms ems_level: ${ems[i][2]}`)
                console.log(`getEms ems_total: ${ems[i][3] / 10 ** 18} eth`)
            }
        } catch (err) {
            console.log(`getEms error: ${err.message}`)
            setError(err.message)
        }
    }

    //window.ethereum
    const connectWalletHandler = async () => {
        /* check if MetaMask is available */
        if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
            try {
                /* request wallet connect */
                console.log("connectWalletHandler 1")
                await window.ethereum.request({ method: "eth_requestAccounts" })
                /* set web3 instance */
                const web3 = new Web3(window.ethereum)
                console.log("connectWalletHandler 2")
                // setWeb3(new Web3(window.ethereum))
                setWeb3(web3)
                /* get list of accounts */
                console.log("connectWalletHandler 3")
                const accounts = await web3.eth.getAccounts()
                console.log("connectWalletHandler 4 account 0", accounts[0])
                setAddress(accounts[0])

                // /* create local contract copy*/
                // // console.log("connectWalletHandler 5")
                // const vm = vendingMachineContract(web3)
                // // console.log("connectWalletHandler 6")
                // setVmContract(vm)

                const em = ContractsWithEm(web3)
                setContractsWE(em)
                console.log("connectWalletHandler 7")
            } catch (err) {
                setError(err.message)
            }

        } else {
            // metamask not installed
            console.log("please install MetaMask")
            alert("please install MetaMask")
        }
    }

    return (
        <div className={styles.main}>
            <Head>
                <title>Contracts With Em</title>
                <meta name="description" content="A blockchain Deeds Rewarding app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <nav className="navbar mt-4 mb-4">
                <div className="container">
                    <div className="navbar-brand">
                        <h1>Deeds Rewarding Contract</h1>
                    </div>
                    <div className="navbar-end ">
                        <button onClick={connectWalletHandler} className="button is-primary">Connect Wallet</button>
                    </div>
                </div>
            </nav>
            <div className='has-background-white'>
                <section className="has-text-light has-background-success">
                    <div id="deeds" className='container'>
                        <p>Please select your deed(s): &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <label id="label_msgX">  &nbsp;&nbsp; </label><br></br><br></br></p>

                        <input type="checkbox" id="checkbox0" name="checkbox0" onChange={checkboxOnChangeHandler} value='0'></input>
                        <label id="label_msg0">  &nbsp;&nbsp; {text_msg}</label><br></br>
                        <input type="checkbox" id="checkbox1" name="checkbox1" onChange={checkboxOnChangeHandler} value="1"></input>
                        <label id="label_msg1">  &nbsp;&nbsp; {text_msg}</label><br></br>
                        <input type="checkbox" id="checkbox2" name="checkbox2" onChange={checkboxOnChangeHandler} value='2'></input>
                        <label id="label_msg2">  &nbsp;&nbsp; {text_msg}</label><br></br>
                        <input type="checkbox" id="checkbox3" name="checkbox3" onChange={checkboxOnChangeHandler} value="3"></input>
                        <label id="label_msg3">  &nbsp;&nbsp; {text_msg}</label><br></br>
                        <input type="checkbox" id="checkbox4" name="checkbox4" onChange={checkboxOnChangeHandler} value='4'></input>
                        <label id="label_msg4">  &nbsp;&nbsp; {text_msg}</label><br></br>
                        <input type="checkbox" id="checkbox5" name="checkbox5" onChange={checkboxOnChangeHandler} value="5"></input>
                        <label id="label_msg5">  &nbsp;&nbsp; {text_msg}</label><br></br>
                        <input type="checkbox" id="checkbox6" name="checkbox6" onChange={checkboxOnChangeHandler} value="6"></input>
                        <label id="label_msg6">  &nbsp;&nbsp; {text_msg}</label><br></br>

                        <br></br>

                    </div>
                </section>
                <br></br><br></br>
                <section>
                    <div id="collectreward" className='container has-text-success has-background-white'>
                        <label>   To collect your reward, select the Collect Reward button:  &nbsp;&nbsp;</label>
                        <button id='collect_reward_button' onClick={collectRewardHandler} className="button is-link is-small"> &nbsp;&nbsp; Collect Reward &nbsp;&nbsp; </button>
                    </div>
                </section>
                <section>
                    <div id="msg_info" className='container has-text-centered has-text-success has-background-white'>
                        <label>   To sign this Deeds Rewarding contract, you will need Sepolia testnet and MetaMask  &nbsp;&nbsp;</label>
                    </div>
                </section>
                <section>
                    <div id="bottom_msg_more" className='container has-text-success has-background-white'>
                        <label id="label_total_reward"> </label> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <button id='more_deeds_button' onClick={collectMoreDeedsHandler} className="button is-link is-small"> &nbsp;&nbsp; Collect More Deeds &nbsp;&nbsp; </button>
                    </div>
                </section>
                <br></br><br></br>
                <section id="bottom_deposit">
                    <div className='container has-text-success has-background-white'>
                        <label>Current Balance in the contract:  &nbsp;{balance} eth  &nbsp;&nbsp; &nbsp;&nbsp;  The amount:</label>&nbsp;&nbsp; <input type="text" id="amount" name="amount"></input>  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <button id='deposit_button' onClick={depositButtonHandler} className="button is-link is-small">  Deposit &nbsp;&nbsp; </button>
                    </div>
                    <br></br><br></br>
                    <section className='mt-5'>
                        <div className='container has-text-centered has-text-success '>
                            <h2>{menuType} &nbsp;&nbsp;&nbsp;&nbsp;</h2>
                        </div>
                    </section>
                </section>
                <section>
                    <div id="display_error" className='container has-text-danger is-align-items-center is-flex '>
                        <p>{error}</p>
                    </div>
                </section>
                <section>
                    <div id="msg_success" className='container has-text-success'>
                        <p>{successMsg}  &nbsp;&nbsp;
                            <button id='more_deeds_button' onClick={collectMoreDeedsHandler} className="button is-link is-small"> &nbsp;&nbsp; Collect More Deeds &nbsp;&nbsp; </button>
                        </p>
                    </div>
                </section>
                <section>
                    <div id="msg_processing" className='container has-text-success'>
                        <label id="processing_label"> </label>
                    </div>
                </section>
            </div>
        </div >
    )
    // the end ContractsWithEm
}

export default Contracts_With_Em