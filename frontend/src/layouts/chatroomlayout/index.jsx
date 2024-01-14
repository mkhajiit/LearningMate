/* eslint-disable no-console */
import axios from 'axios';
import gravatar from 'gravatar';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Link, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import ChannelList from '../../components/Channelist/index';
import CreateChannelModal from '../../components/CreateChannelModal/index';
// import DMList from '../../components/DMList/index';
import Menu from '../../components/Menu/index';
import Modal from '../../components/Modal/index';
import useInput from '../../hooks/useInput';
import DirectMessage from '../../pages/DirectMessage';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Input, Label } from './style2';
import TypingChat from '../../pages/Channel/index';
import ChatBox from '../../components/ChatBox/index';
import { userInfoAction } from '../../store/userInfo';

import {
  AddButton,
  Channels,
  Chats,
  Header,
  LogOutButton,
  MenuScroll,
  ProfileImg,
  ProfileModal,
  RightMenu,
  WorkspaceButton,
  WorkspaceModal,
  WorkspaceName,
  Workspaces,
  WorkspaceWrapper,
} from './style';

const ChatRoom = () => {
  const { meetId, channelId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux에서 사용자 정보 가져오기
  const userinfo = useSelector((state) => state.userInfo);
  const [roomData, setRoomData] = useState([]);
  const [chatValue, onChangeChat, setChatValue] = useInput('');
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
  const [newChannel, onChangeNewChannel, setNewChannel] = useInput('');

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  const [newWorkspace, setNewWorkspace] = useInput('');
  const [newUrl, setNewUrl] = useInput('');

  const getUserData = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:8000/users/list`, { withCredentials: true });
      console.log('Response from getUserData:', response.data.data);

      // 서버에서 받아온 데이터 중에서 현재 로그인한 사용자의 정보를 찾아서 Redux의 userInfo에 저장
      const loggedInUser = response.data.data.find((user) => user.user_id === userinfo.userId);

      if (loggedInUser) {
        dispatch(
          userInfoAction.insert({
            userId: loggedInUser.user_id,
            nickname: loggedInUser.nickname,
            email: loggedInUser.email,
            phone_number: loggedInUser.phone_number,
            profilePath: loggedInUser.profilePath,
          }),
        );
      }
    } catch (error) {
      console.error(error);
    }
  }, [dispatch, userinfo.userId]);

  const onChannelClick = useCallback(
    async (channel) => {
      try {
        const response = await axios.get(
          `http://localhost:8000/chat/chatRoom/${meetId}/channels/${channel.channel_id}`,
        );
        setRoomData(response.data.data.channelChatRoomData);
        setSelectedChannel(channel);
      } catch (error) {
        console.error(error);
      }
    },
    [meetId],
  );

  const getChatData = useCallback(async () => {
    try {
      if (channelId !== null) {
        const response = await axios.get(`http://localhost:8000/chat/chatRoom/${meetId}/channels/${channelId}`);
        setRoomData(response.data.data.channelChatRoomData);
      }
    } catch (error) {
      console.error(error);
    }
  }, [meetId, channelId]);

  useEffect(() => {
    const pollingInterval = setInterval(() => {
      getChatData();
    }, 2000);

    return () => clearInterval(pollingInterval);
  }, [channelId, meetId, getChatData]);

  useEffect(() => {
    getUserData();
    getChatData();
  }, [getUserData, getChatData]);

  const onSubmitForm = (e) => {
    e.preventDefault();
  };

  const onLogOut = useCallback(async () => {
    try {
      await axios.get(`http://localhost:8000/users/logout`);
      navigate('/');
    } catch (error) {
      console.dir(error);
      toast.error(error.response?.data, { position: 'bottom-center' });
    }
  }, [navigate]);

  const onClickCreateWorkspace = useCallback(() => {
    setShowCreateWorkspaceModal(true);
  }, []);

  const onClickAddChannel = useCallback(() => {
    setShowCreateChannelModal(true);
  }, []);

  const onClickUserProfile = useCallback(() => {
    setShowUserMenu((prev) => !prev);
  }, []);

  return (
    <>
      <Header>
        {userinfo.nickname && (
          <RightMenu>
            <span onClick={onClickUserProfile}>
              <ProfileImg
                src={gravatar.url(userinfo.nickname, { s: '28px', d: 'retro' })}
                alt={userinfo.nickname}
                style={{ borderRadius: '20%', width: '40px', height: '40px' }}
              />
            </span>
            {showUserMenu && (
              <Menu style={{ right: 0, top: 38 }} show={showUserMenu} onCloseModal={onClickUserProfile}>
                <ProfileModal>
                  <img
                    src={gravatar.url(userinfo.nickname, { s: '36px', d: 'retro' })}
                    alt={userinfo.nickname}
                    style={{ borderRadius: '20%', width: '40px', height: '40px' }}
                  />
                  <div>
                    <span id='profile-name'>{userinfo.nickname}</span>
                    <span id='profile-active'>Active</span>
                  </div>
                </ProfileModal>
                <LogOutButton onClick={onLogOut}>나가기</LogOutButton>
              </Menu>
            )}
          </RightMenu>
        )}
      </Header>

      <WorkspaceWrapper>
        <Channels>
          <MenuScroll>
            <ChannelList roomData={roomData} setRoomData={setRoomData} onChannelClick={onChannelClick} />
          </MenuScroll>
        </Channels>

        <Chats>
          <MenuScroll>
            {roomData.map((data, idx) => {
              const sentTime = new Date(data.sentTime);
              if (Number.isNaN(sentTime.getTime())) {
                console.error('Invalid date string:', data.sentTime);
                return null;
              }

              // 날짜 포맷팅
              const formattedSentTime = new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
              }).format(sentTime);

              return (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: '23px' }}>
                  {data.senderProfile && (
                    <img
                      src={data.senderProfile}
                      alt={`Profile of ${data.senderNickname}`}
                      style={{ borderRadius: '20%', width: '40px', height: '40px' }}
                    />
                  )}
                  {!data.senderProfile && (
                    <img
                      src={gravatar.url(data.senderNickname, { s: '40px', d: 'retro' })}
                      alt={`Profile of ${data.senderNickname}`}
                      style={{ borderRadius: '20%', width: '40px', height: '40px' }}
                    />
                  )}
                  <div style={{ marginLeft: '7px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ fontSize: '16px', fontWeight: 'bold', marginRight: '7px' }}>
                        {data.senderNickname}
                      </span>
                      <span style={{ color: 'lightgray', fontSize: '10px' }}>{formattedSentTime}</span>
                    </div>
                    <span>{data.content}</span>
                  </div>
                </div>
              );
            })}
            <ChatBox onSubmitForm={onSubmitForm} userData={userinfo} />
          </MenuScroll>
        </Chats>
      </WorkspaceWrapper>
    </>
  );
};

export default ChatRoom;
