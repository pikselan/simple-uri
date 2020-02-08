import React from 'react'
import axios from 'axios'

export default class Uri extends React.Component {
    state = {
        originalUri: '',
        shortBaseUri: 'https://api-uri.pikselan.com',
        finalUri: ''
    }

    handleChange = event => {
        this.setState({originalUri:event.target.value})
    }

    handleSubmit = event => {
        event.preventDefault()

        axios.post('http://localhost:7000/', { 
            originalUri: this.state.originalUri,
            shortBaseUri: this.state.shortBaseUri
         })
            .then(res => {
                //console.log(res)
                //console.log(res.data)
                this.setState({
                    finalUri:res.data.shortUri
                })
            })
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Original Uri:
                        <input type="text" name="originalUri" onChange={this.handleChange} placeholder="Type your Uri in here" />
                        <button type="submit">Short It!</button>
                    </label>
                </form>
                <p><a href={this.state.finalUri}>{this.state.finalUri}</a>
                </p>
            </div>
        )
    }
}