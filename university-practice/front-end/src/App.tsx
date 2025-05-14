/* eslint-disable @typescript-eslint/no-explicit-any */
// src/App.tsx
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useState } from 'react'
import { auth } from './firebaseConfig'

function App() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [idToken, setIdToken] = useState<string | null>(null)
	const [error, setError] = useState<string | null>(null)

	const handleLogin = async () => {
		try {
			const userCredential = await signInWithEmailAndPassword(
				auth,
				email,
				password
			)
			const token = await userCredential.user.getIdToken()
			setIdToken(token)
			setError(null)
		} catch (err: any) {
			setError(err.message)
			setIdToken(null)
		}
	}

	return (
		<div style={{ padding: 20 }}>
			<h1>Login to get ID Token</h1>
			<input
				type='email'
				placeholder='Email'
				value={email}
				onChange={e => setEmail(e.target.value)}
				style={{ display: 'block', marginBottom: 10 }}
			/>
			<input
				type='password'
				placeholder='Password'
				value={password}
				onChange={e => setPassword(e.target.value)}
				style={{ display: 'block', marginBottom: 10 }}
			/>
			<button onClick={handleLogin}>Login</button>

			{idToken && (
		<div>
					<h2>ID Token:</h2>
					<textarea
						value={idToken}
						readOnly
						style={{ width: '100%', height: 200 }}
					/>
				</div>
			)}

			{error && <p style={{ color: 'red' }}>{error}</p>}
		</div>
	)
}

export default App
