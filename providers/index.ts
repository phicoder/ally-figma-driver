import type { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class FigmaDriverProvider {
  constructor(protected app: ApplicationContract) {}

  public async boot() {
    const Ally = this.app.container.resolveBinding('Adonis/Addons/Ally')
    const { FigmaDriver } = await import('../src/FigmaDriver')

    Ally.extend('figma', (_, __, config, ctx) => {
      return new FigmaDriver(ctx, config)
    })
  }
}
