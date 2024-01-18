import { Container } from 'react-bootstrap';

function AboutCard() {
  return (
    <>
      <Container>
        <div className='card mb-3 mt-3' style={{ width: '100%' }}>
          <div className='row g-0'>
            <div className='col-md-4 d-flex align-items-center justify-content-center'>
              <img
                src={`${process.env.PUBLIC_URL}/img/Hani.jpg`}
                className='img-fluid rounded-start'
                alt='profile_image'
                style={{
                  height: '100%',
                  width: '100%',
                  maxHeight: '400px',
                  objectFit: 'cover',
                }}
              />
            </div>
            <div className='col-md-8'>
              <div className='card-body'>
                <h3 className='card-title'>연제헌</h3>
                <p className='card-text'>
                  안녕하세요 프론트엔드 개발자 취업캠프(React) - 4회차 1조 러닝메이트의 조장을 맡은 연제헌입니다.
                  <br /> 러닝메이트 프로젝트에서 회원가입, 로그인, 챗봇, 클라우드타입배포, 깃허브 협업환경구성,
                  <br />
                  about페이지, 강의페이지, 카카오맵 api 관련 기능, 홈페이지, 유저정보, 강의댓글, 강의페이지와 <br />{' '}
                  관련된 DB 를 맡아서 구현했습니다. 본인만의 강의를 강의 페이지에 업로드하고 댓글로 피드백 받으면서 다른
                  사람들과 소통해보세요 또 강의를 듣는 수강생들과 소통할 수 있는 공간또한 모임페이지에서 모임생성후
                  사용하실 수 있습니다. 처음 오신분들도 자신의 주변에 위치한 모임들을 쉽게 찾아 볼 수 있고 회원가입만
                  하시면 로그인후에 쉽게 참여하실 수 있습니다. 프론트엔드 프로젝트는 처음이라 모자란점이 많지만 잘
                  부탁드립니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
export default AboutCard;
