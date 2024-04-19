import PolIcon from "@/components/PolIcon";
import PolHeading from "@/components/polComponents/PolHeading";
import PolText from "@/components/polComponents/PolText";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const StylesDemoView = () => {
  return (
    <div className="max-w-[356px] flex flex-col gap-3">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-end space-y-0">
          <PolIcon name="Github" className="mb-1 mr-1"></PolIcon>
          <PolHeading className="w-fit" size={4}>
            Learning
          </PolHeading>
        </CardHeader>
        <CardContent>
          <PolText className="text-left" type="small">
            Learn from the best
          </PolText>
          <PolText type="muted" className="text-left">
            Unlock the full power of GitHub! Gain expertise and insights from top organizations through guided
            tutorials, boosting productivity, enhancing security, and enabling seamless collaboration.
          </PolText>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <PolText className="text-left" type="p">
            Latest Entries
          </PolText>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-3">
            <div className="flex flex-col">
              <PolText type="muted" className="text-left">
                2 weeks ago
              </PolText>
              <PolText type="small" className="text-left">
                Tim Spent money
              </PolText>
            </div>
            <div className="flex flex-col">
              <PolText type="muted" className="text-left">
                2 weeks ago
              </PolText>
              <PolText type="small" className="text-left">
                JP went on on site and fell off of the crane when he accidentally tripped and fell and gave himself a
                grade5 concusion
              </PolText>
            </div>
            <div className="flex flex-col">
              <PolText type="muted" className="text-left">
                2 weeks ago
              </PolText>
              <PolText type="small" className="text-left">
                905 Expense hits an all time high of $9,205,099
              </PolText>
            </div>
            <div className="flex flex-col">
              <PolText type="muted" className="text-left">
                2 weeks ago
              </PolText>
              <PolText type="small" className="text-left">
                Pol studios is now valuated at $10,000,000
              </PolText>
            </div>
            <div>
              <a
                target="_blank"
                href="https://www.google.com/search?sca_esv=595122014&sxsrf=AM9HkKm2a-SeNf36H7XdhS0Jyh9I4qSxng:1704217086109&q=cats&tbm=isch&source=lnms&sa=X&ved=2ahUKEwiulqawn7-DAxU9I0QIHesrACYQ0pQJegQIDxAB&biw=2020&bih=1278&dpr=1google."
              >
                <PolText className="hover:underline" type="muted">
                  See the rest...
                </PolText>
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader></CardHeader>
      </Card>
    </div>
  );
};

export default StylesDemoView;
