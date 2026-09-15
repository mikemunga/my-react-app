
import {Form ,Link, useActionData} from 'react-router';
import axiosInstance from './axiosInstance';
import { queryClient } from './Query';


export default function SignupPage() { 
const actionData = useActionData();  
const isSubmitting = navigation.state === 'submitting';
 
  return (
    <div style={styles.container}>
      <style>
        @keyframes spin{`
          to {transform :rotate(360deg);}
        `},
      </style>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Create your account</h2>
          <p style={styles.subtitle}>Join us and get started in seconds.</p>
        </div>

       
        <Form method="post" style={styles.form}>
          <div style={styles.inputGroup}>
            <label htmlFor="name" style={styles.label}>Full Name</label>
            <input
              id="name"
              name="first_name"
              type="text"
              placeholder="John Doe"
              required
              style={styles.input}
            />
            {actionData?.errors?.first_name && (<span style={{color:'red', fontSize:'0.8rem'}}>{actionData.errors.first_name}</span>)}
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="email" style={styles.label}>Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              style={styles.input}
            />
            {actionData?.errors?.email && (<span style={{color:'red', fontSize:'0.8rem'}}>{actionData.errors.email}</span>)}
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              style={styles.input}
            />
            {actionData?.errors?.password && (<span style={{color:'red', fontSize:'0.8rem'}}>{actionData.errors.password}</span>)}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              ...styles.button,
              opacity: isSubmitting ? 0.7 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              cursor: isSubmitting ? "not-allowed" : "pointer"
            }}
          >
          {isSubmitting && <span style={styles.spinner}></span>}
          {isSubmitting ? "Creating Account..." : "Sign Up"}
          </button>
        </Form>

        <p style={styles.footerText}>
          Already have an account?{" "}
          <Link to="/login" style={styles.link}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}



export const SignupAction =  async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  
  try{
  const response= await axiosInstance.post('/auth/signup', data,{skipGlobalErrorHandler:true});
    
  if (response.data?.data?.user)
    queryClient.setQueryData(['authUser'], response.data.data.user);
  return {success: true}
   
  }catch(error){
    return {
    success:false,
    error : error.response?.data?.message || 'Regestration faild. Please try again.',
    errors: error.response?.data?.errors || null,
    }
  }
}


// Complete styled framework layout matching modern UI aesthetics
const styles = {
 container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    width: '100%',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    margin:'0'
    
  },
  card: {
    width: "100%",
    maxWidth: "400px",
    padding: "2.5rem",
    borderRadius: "12px",
    backgroundColor: "#ffffff",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  },
  header: {
    textAlign: "center",
    marginBottom: "2rem",
  },
  title: {
    fontSize: "1.75rem",
    fontWeight: "700",
    color: "#111827",
    margin: "0 0 0.5rem 0",
  },
  subtitle: {
    fontSize: "0.875rem",
    color: "#6b7280",
    margin: 0,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem",
  },
  spinner: {
   display: "inline-blok",
   width: "32px",
   height: "32px",
   border: "2px solid rgba(255, 255, 255, 0.3)",
   borderRadius: "50%",
   borderTopColor: "#ffffff",
   marginRight: "12px",
   Animation: "spin 0.8s linear infinite"
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.375rem",
  },
  label: {
    fontSize: "0.875rem",
    fontWeight: "500",
    color: "#374151",
  },
  input: {
    padding: "0.75rem 1rem",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    fontSize: "1rem",
    outline: "none",
    transition: "border-color 0.2s",
  },
  button: {
    padding: "0.75rem",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    fontSize: "1rem",
    fontWeight: "600",
    marginTop: "0.5rem",
    transition: "background-color 0.2s",
  },
  footerText: {
    textAlign: "center",
    fontSize: "0.875rem",
    color: "#4b5563",
    marginTop: "1.5rem",
    marginBottom: 0,
  },
  link: {
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: "500",
  },
};