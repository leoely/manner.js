import HighLight from '~/class/HighLight';
import LocationLexer from '~/class/lexer/LocationLexer';
import locationTemplate from '~/lib/template/locationTemplate';

export default function formateLocation(version) {
  const highLight = new HighLight();
  highLight.addLexer(LocationLexer);
  return highLight.parse(version).map((e) => locationTemplate(e));
}
