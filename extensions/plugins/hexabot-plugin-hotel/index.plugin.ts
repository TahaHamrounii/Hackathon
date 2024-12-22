import { Block } from '@/chat/schemas/block.schema';
import { Context } from '@/chat/schemas/types/context';
import {
  OutgoingMessageFormat,
  StdOutgoingEnvelope,
  StdOutgoingTextEnvelope,
} from '@/chat/schemas/types/message';
import { BlockService } from '@/chat/services/block.service';
import { BaseBlockPlugin } from '@/plugins/base-block-plugin';
import { PluginService } from '@/plugins/plugins.service';
import { PluginBlockTemplate } from '@/plugins/types';
import { SettingService } from '@/setting/services/setting.service';
import { Injectable } from '@nestjs/common';

import SETTINGS from './settings';

const prix = 100;
const type = 'single';
async function fetchData() {
  console.log(
    'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  );
  try {
    const response = await fetch(
      `http://localhost:5000/api/Room/room/${prix}/${type}`,
    );
    const data = await response.json();
    console.log('test', data);
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}

@Injectable()
export class HotelPlugin extends BaseBlockPlugin<typeof SETTINGS> {
  template: PluginBlockTemplate = {
    name: 'Hotel Plugin',
    patterns: ['reservation', 'book', 'hotel'],
    starts_conversation: true,
  };

  constructor(
    pluginService: PluginService,
    private readonly blockService: BlockService,
    private readonly settingService: SettingService,
  ) {
    super('hotel-plugin', pluginService);
  }

  getPath(): string {
    return __dirname;
  }

  async process(
    block: Block,
    context: Context,
    _convId: string,
  ): Promise<StdOutgoingEnvelope> {
    const settings = await this.settingService.getSettings();
    const args = this.getArguments(block);

    /**
     * getRandom() function will pick randomly a string from response_message value
     * array defined in the settings file to build the response.
     */
    const myData = await fetchData();
    const response: string =
      this.blockService.getRandom([...args.response_message]) +
      'there a free room as you wished having the price as' +
      myData[0].price;
    context.vars.email;

    /**
     * returned response from your custom block when triggering it, in this example
     * it returns a text message displaying time now.
     */
    const msg: StdOutgoingTextEnvelope = {
      format: OutgoingMessageFormat.text,
      message: {
        text: this.blockService.processText(response, context, {}, settings),
      },
    };

    return msg;
  }
}
