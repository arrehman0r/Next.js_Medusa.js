import { useRouter } from 'next/navigation';
import React, { useState, useCallback } from 'react';
import Helmet from 'react-helmet';
import { useDispatch } from 'react-redux';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import { toast } from 'react-toastify';
import ALink from '~/components/features/custom-link';
import { loginUser, registerUser } from '~/server/axiosApi';
import { userActions } from '~/store/user';
import { utilsActions } from '~/store/utils';


function Login() {
    const dispatch = useDispatch();
    const router = useRouter()
    const [customerDetails, setCustomerDetails] = useState({
        name: "",
        email: "",
        password: ""
    });

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        console.log("name", name, "value", value)
        setCustomerDetails((prevState) => ({ ...prevState, [name]: value }));
    }, []);

    const handleRegisterUser = async (e) => {
        console.log("register click")
        e.preventDefault();
        const body = {
            email: customerDetails.email,
            password: customerDetails.password,
            first_name: customerDetails.name
        };
        if (customerDetails.email && customerDetails.password) {
            dispatch(utilsActions.setLoading(true))
            try {
                const res = await registerUser(body);
                dispatch(userActions.setUser(res?.customer));
                dispatch(utilsActions.setLoading(false))
                router.push("/")
                toast.success("registeration success");
            }
            catch (error) {
                console.log("error registering user", error);
                dispatch(utilsActions.setLoading(false))
                toast.error("some error occurs", error)
            }
        }
    };

    const handleLoginUser = async (e) => {
        e.preventDefault();
        const body = {
            email: customerDetails.email,
            password: customerDetails.password,
        };
        if (customerDetails.email && customerDetails.password) {
            dispatch(utilsActions.setLoading(true));
            try {
                const res = await loginUser(body);
                if (res && res.customer) {
                    dispatch(userActions.setUser(res.customer));
                    toast.success("Login success");
                    router.push("/");
                } else {
                    throw new Error("Invalid login response");
                }
            } catch (error) {
                console.log("Error in login:", error);
                toast.error("Some error occurred");
            } finally {
                dispatch(utilsActions.setLoading(false));
            }
        }
    };
    
    return (
        <main className="main">
            <Helmet>
                <title>Party Shope Web Store | Login</title>
            </Helmet>

            <h1 className="d-none">Party Shope Web Store - Login</h1>
            <nav className="breadcrumb-nav">
                <div className="container">
                    <ul className="breadcrumb">
                        <li><ALink href="/"><i className="d-icon-home"></i></ALink></li>
                        <li><ALink href="/shop">Party Shop</ALink></li>
                        <li>My Account</li>
                    </ul>
                </div>
            </nav>
            <div className="page-content mt-6 pb-2 mb-10">
                <div className="container">
                    <div className="login-popup">
                        <div className="form-box">
                            <div className="tab tab-nav-simple tab-nav-boxed form-tab">
                                <Tabs selectedTabClassName="active" selectedTabPanelClassName="active">
                                    <TabList className="nav nav-tabs nav-fill align-items-center border-no justify-content-center mb-5">
                                        <Tab className="nav-item">
                                            <span className="nav-link border-no lh-1 ls-normal">Sign in</span>
                                        </Tab>
                                        <li className="delimiter">or</li>
                                        <Tab className="nav-item">
                                            <span className="nav-link border-no lh-1 ls-normal">Register</span>
                                        </Tab>
                                    </TabList>

                                    <div className="tab-content">
                                        <TabPanel className="tab-pane">
                                            <form onSubmit={handleLoginUser}>
                                                <div className="form-group mb-3">
                                                    <input
                                                        type="emial"
                                                        className="form-control"
                                                        id="email"
                                                        name="email"
                                                        placeholder="Username or Email Address *"
                                                        value={customerDetails.email}
                                                        onChange={handleInputChange}
                                                        required
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <input
                                                        type="password"
                                                        className="form-control"
                                                        id="password"
                                                        placeholder="Password *"
                                                        name="password"
                                                        value={customerDetails.password}
                                                        onChange={handleInputChange}
                                                        required
                                                    />
                                                </div>
                                                <div className="form-footer">
                                                    <div className="form-checkbox">
                                                        <input
                                                            type="checkbox"
                                                            className="custom-checkbox"
                                                            id="signin-remember-2"
                                                            name="signin-remember"
                                                        />
                                                        <label className="form-control-label" htmlFor="signin-remember-2">Remember me</label>
                                                    </div>
                                                    <ALink href="#" className="lost-link">Lost your password?</ALink>
                                                </div>
                                                <button className="btn btn-dark btn-block btn-rounded" type="submit">Login</button>
                                            </form>
                                            <div className="form-choice text-center">
                                                <label className="ls-m">or Login With</label>
                                                <div className="social-links">
                                                    <ALink href="#" className="social-link social-google fab fa-google border-no"></ALink>
                                                    <ALink href="#" className="social-link social-facebook fab fa-facebook-f border-no"></ALink>
                                                    <ALink href="#" className="social-link social-twitter fab fa-twitter border-no"></ALink>
                                                </div>
                                            </div>
                                        </TabPanel>

                                        <TabPanel className="tab-pane">
                                            <form onSubmit={handleRegisterUser}>
                                                <div className="form-group">
                                                    <label htmlFor="name">Name:</label>
                                                    <input
                                                        type="name"
                                                        className="form-control"
                                                        id="name"
                                                        name="name"
                                                        placeholder="Your Name *"
                                                        value={customerDetails.name}
                                                        onChange={handleInputChange}
                                                        required
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="register-email-2">Your email address:</label>
                                                    <input
                                                        type="email"
                                                        className="form-control"
                                                        id="email"
                                                        name="email"
                                                        placeholder="Your Email address *"
                                                        value={customerDetails.email}
                                                        onChange={handleInputChange}
                                                        required
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="register-password-2">Password:</label>
                                                    <input
                                                        type="password"
                                                        className="form-control"
                                                        id="password"
                                                        name="password"
                                                        placeholder="Password *"
                                                        value={customerDetails.password}
                                                        onChange={handleInputChange}
                                                        required
                                                    />
                                                </div>
                                                <div className="form-footer">
                                                    <div className="form-checkbox">
                                                        <input
                                                            type="checkbox"
                                                            className="custom-checkbox"
                                                            id="register-agree-2"
                                                            name="register-agree"
                                                            required
                                                        />
                                                        <label className="form-control-label" htmlFor="register-agree-2">I agree to the privacy policy</label>
                                                    </div>
                                                </div>
                                                <button className="btn btn-dark btn-block btn-rounded" type="submit" onClick={handleRegisterUser}>Register</button>
                                            </form>
                                            <div className="form-choice text-center">
                                                <label className="ls-m">or Register With</label>
                                                <div className="social-links">
                                                    <ALink href="#" className="social-link social-google fab fa-google border-no"></ALink>
                                                    <ALink href="#" className="social-link social-facebook fab fa-facebook-f border-no"></ALink>
                                                    <ALink href="#" className="social-link social-twitter fab fa-twitter border-no"></ALink>
                                                </div>
                                            </div>
                                        </TabPanel>
                                    </div>
                                </Tabs>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default React.memo(Login);
