# onlinejudge3-api-sdk

OJ3 API 的 JS SDK 封装。

## 安装

```bash
npm i -S @sdutacm/onlinejudge3-api-sdk
```

## 使用

```typescript
import OnlineJudge3ApiClient from '@sdutacm/onlinejudge3-api-sdk';

const apiClient = new OnlineJudge3ApiClient({
  // 额外参数，如 cookie
});
const session = await apiClient.user.getSession();
if (!session) {
  await apiClient.user.login({
    loginName: 'username-or-email',
    password: 'password',
  });
}
```

## 注意事项

对于每一个 client，其会自动维护实例内的 cookie 存储，并处理 csrf 逻辑。需要多账号时，只需创建多个 client 实例即可。

如果每次短期 API 操作（如反复运行脚本）都通过 login 登录，会使你的账号产生大量 session 造成浪费或潜在的安全问题。因此我们推荐持久化登录态，调用 `apiClient.getCookieString()` 将 cookie 字符串存储至本地，需要复用登录态时，通过 `new OnlineJudge3ApiClient({ cookie: 'your-cookie-string' })` 创建 client。
