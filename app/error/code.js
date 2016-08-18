function codeKV(k, v) {
    return { code: k, result: v };
}

module.exports = {
    IllegalOperation: codeKV(-2, '非法操作'),
    Unknow: codeKV(-1, '未知错误'),
    System: codeKV(0, '系统错误'),
    NotYetOpen: codeKV(1, '功能暂未开放'),


    Success: codeKV(200, '成功'),
    RegisterAgain: codeKV(201, '重复注册'),
    SettingFailed: codeKV(300, '设置失败'),
    ContentEmpty: codeKV(301, '内容为空'),

    Occurred: codeKV(400, '发生错误'),
    ZoneOrMobileEmpty: codeKV(401, '国家代码或手机号码为空'),
    SmsVerifyEmpty: codeKV(402, '请求校验的验证码为空'),
    ZoneEmpty: codeKV(403, '国家代码为空'),
    MobileEmpty: codeKV(404, '手机号码为空'),


    MobileInvalid: codeKV(411, '手机号码格式错误'),
    SmsVerifyWrong: codeKV(412, '验证码错误'),
    PasswordWrong: codeKV(413, '密码错误'),
    DBOperateWrong: codeKV(414, '数据库操作错误'),
    UserOrPasswordWrong: codeKV(415, '用户或者密码错误'),
    PasswordEmpty: codeKV(416, '密码为空'),

    TokenInvalid: codeKV(421, 'token无效'),


    DeviceInexistence: codeKV(431, '设备不存在'),
    UserInexistence: codeKV(432, '用户不存在'),
    DeviceShadowInexistence: codeKV(433, '影子设备不存在'),
    GroupInexistence: codeKV(434, '该组不存在'),
    GroupCreateLimit: codeKV(435, '该用户创建组数已达上限'),
    DeviceAlreadyJoin: codeKV(436, '该设备已加入组'),
    UserAlreadyJoin: codeKV(437, '该用户已加入组'),
    NotGroupAdmin: codeKV(438, '非组管理员'),
    NotGroupMember: codeKV(439, '非组成员'),
    NotGroupDevice: codeKV(440, '非组设备'),
    GroupAdmin: codeKV(441, '组管理员'),


    VersionWrong: codeKV(451, '版本不正确'),
    RegisterFaild: codeKV(461, '注册不成功'),
    NotDeviceOwner: codeKV(471, '非设备管理员'),

    AuthorityExist: codeKV(481, '该用户权限已添加'),
    AuthorityInexistence: codeKV(482, '该用户权限未添加'),
    AuthorityAlreadyJoin: codeKV(483, '组员已拥有该权限'),
    AuthorityNotJoin: codeKV(484, '组员没有该权限'),

    RoleInexistence: codeKV(491, '该角色不存在'),

    DeviceKeyInvalid: codeKV(501, '非法设备秘钥'),

    DeviceDataRepeat: codeKV(601, '数据重复上报'),
    DeviceDataEmpty: codeKV(602, '上报数据为空'),
};