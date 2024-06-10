import React from 'react'
import Footer from '../components/Footer'
import NavBar from '../components/NavBar'
import { useNavigate } from 'react-router-dom'
function About() {
  const navigate = useNavigate();
  return (
    <div>
    <NavBar/>
    <section className='bg-stone-950 p-10 text-stone-200'>
      <h1 className=' text-5xl font-bold '>Safely send money to friends and <br/>family, no matter where they bank!1</h1>
      <p className=' text-xl mt-6'>
      Pitching in on snacks for couples’ game night? Need to get paid<br/> back for covering the group vacation?
       Repay® is a great way to <br/>send money to friends and family, even if
        they bank somewhere<br/> different than you do.1 Plus, it’s in a lot of banking apps,
         probably <br/>yours! No worries if your bank or credit
       union doesn’t offer Repay®<br/> yet – you can download and use the Repay® app until they do.
      </p>
    </section>
    <section>
      <h1 className='text-center mt-5 text-5xl font-bold'>How Repay Works</h1>
      <div className='flex m-8 p-4 justify-center  rounded-md shadow-md'>
      <div className='mx-8'>
         <h1 className='font-bold text-xl'>Step 1</h1>
        <h2 className='font-bold text-4xl text-rose-500'>Create a Repay Account</h2>
        <p className='text-xl'>
Get started by enrolling your email or mobile number through <br/>your mobile banking app or with the Repay® app.</p>
      </div>
       
        <div>
          <img src='money.png' className=' w-96 h-96' alt=""/>
        </div>
      </div>
      <div className='flex m-8 p-6  justify-center rounded-md shadow-md'>
      <div>
          <img src='money.png' className=' rounded-full w-96 h-96' alt=""/>
        </div>
      <div className='mx-8'>
         <h1 className='font-bold text-xl'>Step 1</h1>
        <h2 className='font-bold text-4xl text-rose-500'>Create a Repay Account</h2>
        <p className='text-xl'>
Get started by enrolling your email or mobile number through your mobile <br/>banking app or with the Repay® app.</p>
      </div>
       
        
      </div>
      <div className='flex m-8 p-6  justify-center rounded-md shadow-md'>
      <div className='mx-8'>
         <h1 className='font-bold text-xl'>Step 1</h1>
        <h2 className='font-bold text-4xl text-rose-500'>Create a Repay Account</h2>
        <p className='text-xl'>
Get started by enrolling your email or mobile number through your  <br/>mobile banking app or with the Repay® app.</p>
      </div>
       
        <div>
          <img src='money.png' className='rounded-full w-96 h-96' alt=""/>
        </div>
      </div>
    </section>
    <div className='bg-stone-800 flex flex-col items-center text-stone-200 p-10'>
  <h1 className="text-6xl text-center">Start Using Repay Now.</h1>
  <button onClick={()=>navigate('/account')} className='py-3 my-6 rounded-md shadow-md bg-stone-950 w-32 font-bold'>Get Started</button>
</div>

      <Footer/>
    </div>
  )
}

export default About
