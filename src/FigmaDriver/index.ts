/*
|--------------------------------------------------------------------------
| Ally Oauth Figma driver
|--------------------------------------------------------------------------
|
| This is a Figma implementation of the Oauth driver.
|
|
*/

import type { ApiRequestContract } from '@ioc:Adonis/Addons/Ally'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Oauth2Driver, RedirectRequest } from '@adonisjs/ally/build/standalone'
import { FigmaScopes } from './FigmaScopes'
import { FigmaUserResponse } from './FigmaUserResponse'

export type FigmaDriverAccessToken = {
  token: string
  type: 'bearer'
}

export type FigmaDriverConfig = {
  driver: 'figma'
  clientId: string
  clientSecret: string
  callbackUrl: string
  authorizeUrl?: string
  accessTokenUrl?: string
  userInfoUrl?: string
}

export class FigmaDriver extends Oauth2Driver<FigmaDriverAccessToken, FigmaScopes> {
  protected authorizeUrl = 'https://www.figma.com/oauth'

  protected accessTokenUrl = 'https://www.figma.com/api/oauth/token'

  protected userInfoUrl = 'https://api.figma.com/v1/me'

  protected codeParamName = 'code'

  protected errorParamName = 'error'

  protected stateCookieName = 'figma_oauth_state'

  protected stateParamName = 'state'

  protected scopeParamName = 'scope'

  protected scopesSeparator = ' '

  protected getAuthenticatedRequest(url: string, token: string) {
    const request = this.httpClient(url)
    request.header('Authorization', `Bearer ${token}`)
    request.header('Accept', 'application/json')
    request.parseAs('json')
    return request
  }

  protected configureRedirectRequest(request: RedirectRequest<FigmaScopes>) {
    request.param('scope', 'file_read')
    request.param('response_type', 'code')
  }

  constructor(ctx: HttpContextContract, public config: FigmaDriverConfig) {
    super(ctx, config)

    this.loadState()
  }

  protected async getUserInfo(token: string, callback?: (request: ApiRequestContract) => void) {
    const request = this.getAuthenticatedRequest(this.config.userInfoUrl || this.userInfoUrl, token)
    if (typeof callback === 'function') {
      callback(request)
    }

    const body: FigmaUserResponse = await request.get()
    return {
      id: body.id,
      name: body.handle,
      nickName: body.handle,
      avatarUrl: body.img_url,
      email: body.email,
      emailVerificationState: 'unsupported' as 'unsupported',
      original: body,
    }
  }

  public accessDenied(): boolean {
    const error = this.getError()
    if (!error) {
      return false
    }

    return error === 'access_denied'
  }

  public async user(callback?: (request: ApiRequestContract) => void) {
    const token = await this.accessToken(callback)
    const user = await this.getUserInfo(token.token, callback)

    return {
      ...user,
      token,
    }
  }

  public async userFromToken(token: string, callback?: (request: ApiRequestContract) => void) {
    const user = await this.getUserInfo(token, callback)

    return {
      ...user,
      token: { token, type: 'bearer' as const },
    }
  }
}
