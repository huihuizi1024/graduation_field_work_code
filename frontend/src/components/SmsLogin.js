import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendSmsCode, loginWithSms } from '../api/sms';
import './SmsLogin.css';

const SmsLogin = ({ onLoginSuccess, selectedIdentity = 'student' }) => {
    const [phone, setPhone] = useState('');
    const [code, setCode] = useState('');
    const [countdown, setCountdown] = useState(0);
    const [loading, setLoading] = useState(false);
    const [loginLoading, setLoginLoading] = useState(false);
    const navigate = useNavigate();

    // 倒计时效果
    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [countdown]);

    // 发送验证码
    const handleSendCode = async () => {
        if (!phone) {
            alert('请输入手机号');
            return;
        }

        if (!/^1[3-9]\d{9}$/.test(phone)) {
            alert('请输入正确的手机号格式');
            return;
        }

        if (countdown > 0) {
            return;
        }

        setLoading(true);
        try {
            const response = await sendSmsCode(phone, 'login');
            
            if (response.code === 200) {
                alert('验证码发送成功！请查看控制台获取验证码');
                setCountdown(60);
            } else {
                alert(response.message || '发送失败，请稍后重试');
            }
        } catch (error) {
            console.error('发送验证码失败:', error);
            alert('发送失败，请稍后重试');
        } finally {
            setLoading(false);
        }
    };

    // 登录
    const handleLogin = async () => {
        if (!phone || !code) {
            alert('请输入手机号和验证码');
            return;
        }

        if (!/^1[3-9]\d{9}$/.test(phone)) {
            alert('请输入正确的手机号格式');
            return;
        }

        if (!/^\d{6}$/.test(code)) {
            alert('请输入6位数字验证码');
            return;
        }

        setLoginLoading(true);
        try {
            const response = await loginWithSms(phone, code, selectedIdentity);
            
            // 详细调试日志
            console.log('SMS登录响应完整数据:', response);
            console.log('响应码:', response.code);
            console.log('响应消息:', response.message);
            console.log('响应数据:', response.data);
            
            if (response.code === 200) {
                console.log('登录成功，开始处理...');
                
                // 存储登录信息
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('username', response.data.user.username);
                localStorage.setItem('role', response.data.user.role.toString());
                localStorage.setItem('userInfo', JSON.stringify(response.data.user));
                if (response.data.token) {
                    localStorage.setItem('token', response.data.token);
                }

                console.log('localStorage已更新:');
                console.log('- isAuthenticated:', localStorage.getItem('isAuthenticated'));
                console.log('- username:', localStorage.getItem('username'));
                console.log('- role:', localStorage.getItem('role'));
                console.log('- token存在:', !!localStorage.getItem('token'));

                alert('登录成功！');

                // 调用登录成功回调
                if (onLoginSuccess) {
                    console.log('调用登录成功回调...');
                    onLoginSuccess(selectedIdentity);
                }

                // 延迟跳转，确保状态更新完成
                console.log('准备跳转，用户角色:', response.data.user.role);
                setTimeout(() => {
                    // 根据用户角色跳转
                    if (response.data.user.role === 4) {
                        console.log('跳转到管理员页面: /admin');
                        navigate('/admin');
                    } else {
                        console.log('跳转到首页: /');
                        navigate('/');
                    }
                    // 强制刷新页面状态
                    console.log('开始刷新页面...');
                    window.location.reload();
                }, 100);
            } else {
                console.log('登录失败，响应码:', response.code, '消息:', response.message);
                alert(response.message || '登录失败');
            }
        } catch (error) {
            console.error('登录失败:', error);
            const errorMessage = error.response?.data?.message || '登录失败，请稍后重试';
            alert(errorMessage);
        } finally {
            setLoginLoading(false);
        }
    };

    return (
        <div className="sms-login-container">
            <div className="sms-login-form">
                <h3>📱 短信验证码登录</h3>
                
                <div className="form-group">
                    <label>手机号</label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                        placeholder="请输入手机号"
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label>验证码</label>
                    <div className="code-input-group">
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            placeholder="请输入6位验证码"
                            className="form-input code-input"
                        />
                        <button
                            type="button"
                            onClick={handleSendCode}
                            disabled={loading || countdown > 0}
                            className="send-code-btn"
                        >
                            {loading ? '发送中...' : countdown > 0 ? `${countdown}s` : '获取验证码'}
                        </button>
                    </div>
                </div>

                <div className="demo-tip">
                    💡 提示：点击"获取验证码"后，请查看浏览器控制台(F12)获取验证码
                </div>

                <button
                    onClick={handleLogin}
                    disabled={loginLoading}
                    className="login-btn"
                >
                    {loginLoading ? '登录中...' : '登录'}
                </button>
            </div>
        </div>
    );
};

export default SmsLogin; 