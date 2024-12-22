import { PluginSetting } from '@/plugins/types';
import { SettingType } from '@/setting/schemas/types';

const var1 = 'hello';
const url = 'https://my-json-server.typicode.com/TahaHamrounii/json/user';
//added fetchData function to fetch data from the API
async function fetchData() {
  try {
    const response = await fetch(url);
    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}

const var2 = fetchData();

export default [
  {
    label: 'response_message',
    group: 'default',
    type: SettingType.multiple_text,
    value: [/*var2*/ var1],
  },
] as const satisfies PluginSetting[];
