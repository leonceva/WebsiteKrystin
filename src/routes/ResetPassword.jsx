import { useState } from "react";
import DesktopLayout from "../layouts/DesktopLayout";
import MobileLayout from "../layouts/MobileLayout";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import axios from "../api/axios";

const ResetPassword = () => {
    return (
        <>
            <DesktopLayout content={<DesktopContent />} />
            <MobileLayout content={<MobileContent />} />
        </>
    );
};

export const DesktopContent = () => {
    const [searchParams] = useSearchParams();
    const resetToken = searchParams.get("reset_token");
    const [errorMessage, setErrorMessage] = useState(false);
    const [formData, setFormData] = useState({
        newPassword: "",
        confirmPassword: "",
    });

    // For submit handler
    const handleSubmit = (e) => {
        e.preventDefault();
        if (checkConstraints()) {
            if (comparePasswords()) {
                // Send password to server
                axios
                    .patch("http://localhost:8080/resetPassword", {
                        resetToken: resetToken,
                        newPassword: formData.newPassword,
                    })
                    .then((res) => {
                        console.log(res);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            } else {
                setErrorMessage("Passwords don't match");
            }
        } else {
            return;
        }
    };

    // Form change handler
    const handleChange = (e) => {
        setErrorMessage(false);
        const { name, value } = e.target;
        // Update form data content
        setFormData((prevFormData) => {
            return { ...prevFormData, [name]: value };
        });
    };

    const checkConstraints = () => {
        if (formData.newPassword.length < 6) {
            setErrorMessage("Password must be 6 characters or longer");
            return false;
        }
        if (formData.newPassword.search(/[a-z]/) < 0) {
            setErrorMessage("Password must contain a lowercase letter");
            return false;
        }
        if (formData.newPassword.search(/[A-Z]/) < 0) {
            setErrorMessage("Password must contain an uppercase letter");
            return false;
        }

        if (formData.newPassword.search(/[0-9]/) < 0) {
            setErrorMessage("Password must contain a number");
            return false;
        }
        if (formData.newPassword.search(/[^A-Za-z 0-9]/g) < 0) {
            setErrorMessage("Password must contain a special character");
            return false;
        }
        return true;
    };

    const comparePasswords = () => {
        return formData.newPassword === formData.confirmPassword;
    };

    return (
        <>
            <DesktopDiv>
                <div className="container">
                    <h2>Reset Password</h2>
                    <div>
                        Please enter the new password for your account. <br />
                        <ul>
                            <li>
                                The new password must be at least 6 characters
                                long.
                            </li>
                            <li>
                                The new password must contain the following: a
                                lowercase leter, an upeprcase letter, a number,
                                and a special character.
                            </li>
                        </ul>
                    </div>
                    <form>
                        <span
                            className={`error-message ${
                                errorMessage ? "show" : "hide"
                            }`}
                            placeholder=""
                        >
                            {errorMessage || "placeholder"}
                        </span>
                        <div className="input">
                            <label htmlFor="newPassword">New Password:</label>
                            <input
                                type="password"
                                name="newPassword"
                                id="newPassword"
                                autoComplete="new-password"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="input">
                            <label htmlFor="confirmPassword">
                                Confirm Password:
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                id="confirmPassword"
                                autoComplete="off"
                                onPaste={(e) => {
                                    e.preventDefault();
                                    return false;
                                }}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    return false;
                                }}
                                onChange={handleChange}
                            />
                        </div>
                        <button type="submit" onClick={handleSubmit}>
                            Change Password
                        </button>
                    </form>
                </div>
            </DesktopDiv>
        </>
    );
};

export const DesktopDiv = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: calc(min(2vw, 2vh));

    & > .container {
        max-width: 60%;
        width: fit-content;
        margin-top: 10%;
        border: 2px solid #333;
        border-radius: 20px;
        background-color: #d0dce7;
        display: flex;
        flex-direction: column;
        align-items: center;

        & > h2 {
            padding-top: 1vh;
        }

        & > div {
            text-align: start;
            margin: 0;
            padding: 0 0.5vw;
        }

        & > form {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 80%;
            padding-bottom: 1vh;

            & > .error-message {
                width: 100%;
                text-align: end;
                padding-right: 5%;
                color: red;
                padding-bottom: 0.5vh;
            }

            & > .show {
                opacity: 1;
            }

            & > .hide {
                opacity: 0;
            }

            & > .input {
                width: 100%;
                padding-bottom: 1vh;

                & > label {
                    width: 40%;
                }
                & > input {
                    width: 60%;
                }
            }

            & > button {
                max-width: 50%;
                margin-top: 1vh;
                margin-bottom: 2vh;
                background-color: #879db3;
                border: 2px #333 solid;
                border-radius: 10px;
                padding: 0.5vh 1vw;
                font-size: calc(min(2vh, 2vw));
                box-shadow: 2px 2px 2px #333;

                &:hover {
                    background-color: #6e88a1;
                    cursor: pointer;
                }
                &:active {
                    translate: 2px 2px;
                    box-shadow: 0 0 0;
                }
            }
        }
    }
`;

export const MobileContent = () => {
    return <>In development..</>;
};

export default ResetPassword;
