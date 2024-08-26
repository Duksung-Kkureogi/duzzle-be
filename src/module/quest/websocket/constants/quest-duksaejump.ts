const DuksaeJumpPrefix: string = 'quest:duksae-jump';

export const CORRECT_JUMP_POINTS: number = 1;
export const MISSING_JUMP_PENALTY: number = 1;

export const DuksaeJumpMessagePattern = {
  // 서버 수신 메시지
  Inbound: {
    Start: [DuksaeJumpPrefix, 'start'].join(':'),
    Success: [DuksaeJumpPrefix, 'success'].join(':'),
    Fail: [DuksaeJumpPrefix, 'fail'].join(':'),
  },

  // 서버 발신 메시지
  Outbound: {
    Object: 'object',
    Speed: 'speed',
    Health: 'Health',
    Score: 'score',
    GameOver: 'gameover',
    Result: 'result',
  },
};
